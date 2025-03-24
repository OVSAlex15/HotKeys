from multiprocessing import Process, Value
import time
import cv2
import os
import json 
from datetime import datetime, timedelta
import numpy as np
from plyer import notification

VIOLATIONS_FILE = "violations.json"
current_violations = Value('i', 0)

face_cascade_path = 'venv\Lib\site-packages\cv2\data\haarcascade_frontalface_default.xml'
face_cascade = cv2.CascadeClassifier(face_cascade_path)
eye_cascade_path = 'venv\Lib\site-packages\cv2\data\haarcascade_eye.xml'

#функции для подсчета для графика
def init_violations_file():
    if not os.path.exists(VIOLATIONS_FILE):
        base_data = []
        today = datetime.now()
        for i in range(6, -1, -1):
            date = today - timedelta(days=i)
            base_data.append({
                "date": date.strftime("%Y-%m-%d"),
                "day": date.strftime("%a"),
                "count": 0
            })
        with open(VIOLATIONS_FILE, "w") as f:
            json.dump(base_data, f)

def save_violation():
    init_violations_file()
    today = datetime.now().strftime("%Y-%m-%d")
    
    with open(VIOLATIONS_FILE, "r+") as f:
        data = json.load(f)
        
        # Удаляем старые записи (>7 дней)
        data = [entry for entry in data if 
               (datetime.now() - datetime.strptime(entry["date"], "%Y-%m-%d")).days <= 7]
        
        found = False
        for entry in data:
            if entry["date"] == today:
                entry["count"] += 1
                found = True
                break
                
        if not found:
            data.append({
                "date": today,
                "day": datetime.now().strftime("%a"),
                "count": 1
            })
        
        f.seek(0)
        json.dump(data, f)
        f.truncate()

# Функция для отображения уведомлений
def show_notification(title, message,is_check=False):

    notification.notify(
        title=title,  
        message=message, 
        app_name='EyeSafe',
        timeout=7  # Время отображения уведомления в секундах 
    )

    if not is_check:  
        save_violation()

KNOWN_WIDTH = 15  
KNOWN_DISTANCE = 50  

def calibrate_focal_length():
    cap = cv2.VideoCapture(0)
    for _ in range(10):  
        ret, frame = cap.read()
        if ret:
            break
    else:
        cap.release()
        return 700  
    gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)
    faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
    cap.release()
    
    if len(faces) > 0:
        face_width = faces[0][2]
        return (face_width * KNOWN_DISTANCE) / KNOWN_WIDTH
    
FOCAL_LENGTH = calibrate_focal_length()

def calculate_distance(face_width):
    global FOCAL_LENGTH  
    
    if FOCAL_LENGTH is None: 
        FOCAL_LENGTH = 390.0 

    if face_width != None:

        distance = (KNOWN_WIDTH * FOCAL_LENGTH) / face_width
        return min(max(distance, 10), 100)
    
def detect_face_and_lighting(stop_flag, frame_skip=60): #frame_skip отвечает за частоту анализа кадров
    num_length = 0
    num_light = 0
    show_notification('Проверьте веб-камеру', 'Убедитесь что веб-камера подключена,исправна и не закрыта шторкой',is_check=True) #проверка пользователя перед работой
    
    eye_cascade = cv2.CascadeClassifier(eye_cascade_path)
    cap = cv2.VideoCapture(0) 

    if not cap.isOpened():
        print("Не удалось открыть камеру")
        return
    

    cap.set(cv2.CAP_PROP_FRAME_WIDTH, 640)
    cap.set(cv2.CAP_PROP_FRAME_HEIGHT, 480)


    time.sleep(3)
    frame_count = 0

    while not stop_flag.value:
        ret, frame = cap.read()
        
        if not ret:
            break
        
        frame_count += 1
        
        if frame_count % frame_skip == 0:
            gray = cv2.cvtColor(frame, cv2.COLOR_BGR2GRAY)

            faces = face_cascade.detectMultiScale(gray, scaleFactor=1.1, minNeighbors=5, minSize=(30, 30))
            
            if len(faces) > 0:
                x, y, w, h = faces[0]
                distance = calculate_distance(w)
            
                if distance < 35: #35 маловато, надо калибровать
                    print('length')
                    num_length +=1
                    print(num_length)
                    
                    show_notification("Расстояние до монитора", "Вы находитесь слишком близко к монитору, отдалитесь!")
                    time.sleep(7)  # можно менять как угодно
        
            avg_intensity = np.average(gray)
            if avg_intensity < 50:
                print('active')
                num_light +=1
                print(num_light)
                show_notification('Освещенность', 'У вас слишком темно. Это плохо влияет на состояние глаз. Увеличьте освещение!')
                time.sleep(7)

            
            
            
        if cv2.waitKey(1) & 0xFF == ord('q'):
            break

    cap.release()
    cv2.destroyAllWindows()

def start_detection():
    stop_flag.value = False
    detection_process = Process(target=detect_face_and_lighting, args=(stop_flag,))
    detection_process.start()

def stop_detection():
    stop_flag.value = True

if __name__ == "__main__":
    stop_flag = Value('i', 0)
    detection_process = Process(target=detect_face_and_lighting, args=(stop_flag,))

    detection_process.start()
    """
    time.sleep(10)  # Запуск 10 секунд
    stop_flag.value = 1  # Останавливаем процесс
    """
    
    detection_process.join()  