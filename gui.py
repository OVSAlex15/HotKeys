import subprocess
import requests
import sys
import json
from PyQt5 import QtCore, QtGui, QtWidgets
from PyQt5.QtCore import QThread, pyqtSignal, QTimer, QRect, Qt
from multiprocessing import Process, Value
from mix import detect_face_and_lighting 
from PyQt5.QtChart import QChart, QChartView, QBarSet, QBarSeries, QValueAxis, QBarCategoryAxis
from PyQt5.QtGui import QPainter, QColor, QPen, QBrush,  QFont
from datetime import datetime, timedelta
import os
import io
import numpy as np
from PyQt5.QtWidgets import QApplication, QWidget
import matplotlib.pyplot as plt

VIOLATIONS_FILE = "violations.json" 

class DetectionThread(QThread):
    update_signal = pyqtSignal(str)  
    finished_signal = pyqtSignal()  
    
    def __init__(self, stop_flag):
        super().__init__()
        self.stop_flag = stop_flag
    
    def run(self):
        detect_face_and_lighting(self.stop_flag)  
        self.finished_signal.emit()  

class Ui_test(object):
    def setupUi(self, test):
        test.setObjectName("test")
        test.setFixedSize(710, 410)  #!
        self.centralwidget = QtWidgets.QWidget(test)
        self.centralwidget.setStyleSheet("background-color:#f9f9f9;")
        self.centralwidget.setObjectName("centralwidget")
        # Кнопка для входа
        self.pushButton = QtWidgets.QPushButton(self.centralwidget)
        self.pushButton.setGeometry(QtCore.QRect(290, 300, 120, 30))  # положение, ширина, высота в px
        self.pushButton.setStyleSheet("""
                            QPushButton {
                            background-color:#EB6827;  /* Цвет по умолчанию */
                            border-radius:15px;
                            color:white;
                            font-family:JetBrains Mono;
                            font-size:15pt;
                        }
                        QPushButton:hover {
                            background-color: #753413;  
                        }
                    """)
        # Поле ввода ключа
        self.lineEdit = QtWidgets.QLineEdit(self.centralwidget)
        self.lineEdit.setGeometry(QtCore.QRect(200, 210, 300, 40))
        self.lineEdit.setStyleSheet("border-radius:13px;"
                                     "background-color:white;"
                                     "color:black;"
                                     "font-size:13pt;"
                                     "padding: 10px;")
        self.lineEdit.setObjectName("lineEdit")
        # Метка для отображения статуса ключа
        self.statusLabel = QtWidgets.QLabel(self.centralwidget)
        self.statusLabel.setGeometry(QtCore.QRect(100, 250, 500, 40))
        self.statusLabel.setAlignment(QtCore.Qt.AlignCenter)
        self.statusLabel.setFont(QtGui.QFont('JetBrains Mono', 13))
        self.statusLabel.setObjectName("statusLabel")
        self.statusLabel.setStyleSheet("color:red")
        # Метка для изображения
        self.label = QtWidgets.QLabel(self.centralwidget)
        self.label.setGeometry(QtCore.QRect(170, 70, 341, 61))
        self.label.setText("")
        self.label.setTextFormat(QtCore.Qt.TextFormat.MarkdownText)
        self.label.setPixmap(QtGui.QPixmap("img/ilya.png"))  # на маке jpeg!
        self.label.setScaledContents(True)
        self.label.setWordWrap(False)
        self.label.setOpenExternalLinks(False)
        self.label.setObjectName("label")
        test.setCentralWidget(self.centralwidget)


        self.retranslateUi(test)
    
    def retranslateUi(self, test):
        _translate = QtCore.QCoreApplication.translate
        test.setWindowTitle(_translate("test", "EyeSafe"))
        self.pushButton.setText(_translate("test", "Login"))
        self.lineEdit.setPlaceholderText(_translate("test", "Введите ключ..."))

class HomePage(QtWidgets.QWidget):
    def __init__(self):
        super(HomePage, self).__init__()
        self.initUI()
    
    def initUI(self):
        #small logo
        self.small_logo = QtWidgets.QLabel(self)
        self.small_logo.setText("")
        self.small_logo.setTextFormat(QtCore.Qt.TextFormat.MarkdownText)
        self.small_logo.setGeometry(QtCore.QRect(10, 7, 106, 26))
        self.small_logo.setPixmap(QtGui.QPixmap("img/small_logo"))  # на маке jpeg!
        self.small_logo.setScaledContents(True)
        self.small_logo.setWordWrap(False)
        self.small_logo.setOpenExternalLinks(False)
        self.small_logo.setObjectName("label")

        # Создание QLabel для отображения изображения диаграммы
        self.image_label = QtWidgets.QLabel(self)
        self.image_label.setGeometry(QtCore.QRect(50, 80, 600, 200))  # положение, ширина, высота в px
        
        # Кнопка "Start"
        self.start_button = QtWidgets.QPushButton("Start", self)
        self.start_button.setGeometry(QtCore.QRect(290, 325, 120, 30))
        self.start_button.setStyleSheet("""
                            QPushButton {
                            background-color:#EB6827;  /* Цвет по умолчанию */
                            border-radius:15px;
                            width:100px;
                            color:white;
                            font-family:JetBrains Mono;
                            font-size:15pt;
                        }
                        QPushButton:hover {
                            background-color: #753413;  
                        }
                    """)
        self.start_button.clicked.connect(self.start_detection)
        self.start_button.clicked.connect(self.changer_to_start)

        # Кнопка "Stop"
        self.stop_button = QtWidgets.QPushButton("Stop", self)
        self.stop_button.setGeometry(QtCore.QRect(290, 325, 120, 30))
        self.stop_button.setStyleSheet("""
                            QPushButton {
                            background-color:#d9534f;  /* Цвет по умолчанию */
                            border-radius:15px;
                            color:white;
                            font-family:JetBrains Mono;
                            font-size:15pt;
                        }
                        QPushButton:hover {
                            background-color: #672725;  
                        }
                    """)
        self.stop_button.hide()
        self.stop_button.clicked.connect(self.stop_detection)
        self.stop_button.clicked.connect(self.changer_to_stop)
        self.stop_button.setEnabled(False)
    
    

        self.data = self.load_data_from_json(VIOLATIONS_FILE)

        self.days_of_week = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
        self.short_days_of_week = ['m', 't', 'w', 't', 'f', 's', 's']
        self.update_plot()

        self.timer = QTimer(self)
        self.timer.timeout.connect(self.update_data)
        self.timer.start(2000)  

    def load_data_from_json(self, filename):
        if not os.path.exists(filename):
            print(f"Файл {filename} не найден.")
            return []
        try:
            with open(filename, 'r') as file:
                data = json.load(file)
            return data
        except json.JSONDecodeError as e:
            print(f"Ошибка при чтении JSON файла: {e}")
            return []

    def update_data(self):
        self.data = self.load_data_from_json(VIOLATIONS_FILE)
        self.update_plot()

    def filter_data_for_last_7_days(self, data):
        today = datetime.now().date()
        seven_days_ago = today - timedelta(days=6)  # Включая текущий день
        
        # Фильтруем данные за последние 7 дней
        filtered_data = [
            entry for entry in data
            if seven_days_ago <= datetime.strptime(entry['date'], '%Y-%m-%d').date() <= today
        ]
        
        return filtered_data

    def update_plot(self):
        plt.clf()

        
        filtered_data = self.filter_data_for_last_7_days(self.data)

       
        counts = {day: 0 for day in self.days_of_week}
        for entry in filtered_data:
            day = entry['day']
            count = entry['count']
            if day in counts:
                counts[day] += count

        
        self.values = [counts[day] for day in self.days_of_week]

        
        today_index = datetime.today().weekday()

        
        colors = ['white'] * 7 #0C4B2D
        colors[today_index] = 'white'

       
        fig, ax = plt.subplots(figsize=(7, 5))
        fig.patch.set_facecolor('#104359')
        ax.set_facecolor('#104359') #137A42

        
        x = np.arange(len(self.days_of_week))  
        width = 0.8 # Ширина столбцов
        ax.bar(x, self.values, width, color=colors, edgecolor='none')

        for i, value in enumerate(self.values):
            if value > 0:  
                text_color = 'black' if colors[i] == 'white' else 'white'  # Черный текст для белого столбика и белый для остальных
                ax.text(
                    x[i],
                    value / 2,
                    str(value),
                    ha='center', va='center',
                    color=text_color, fontsize=18, fontweight='regular', fontname='JetBrains Mono'
                )

        font_properties = {
            'family': 'JetBrains Mono',  
            'size': 15,         
            'weight': 'regular'    
        }

        ax.set_xticks(x)
        ax.set_xticklabels(self.short_days_of_week, **font_properties ,fontsize=16, color='white') #здесь менять кегль для дней недели
        ax.set_yticks([])

        for spine in ax.spines.values():
            spine.set_visible(False)

        ax.tick_params(left=False, bottom=False)

   
        """
        plt.text(-0.3, max(self.values) + 3, 'Dashboard', fontsize=25, fontweight='regular',
                 color='white', ha='left', va='top',
                 fontname='JetBrains Mono')
        """
        ax.set_ylim(0, max(self.values) + 3)

        buf = io.BytesIO()
        plt.savefig(buf, format='png', facecolor=fig.get_facecolor(), bbox_inches='tight', pad_inches=0.1)
        buf.seek(0)

        pixmap = QtGui.QPixmap()
        pixmap.loadFromData(buf.read())
        
        self.image_label.setPixmap(pixmap)
        plt.close(fig)
        self.image_label.setGeometry(QtCore.QRect(20, 80, 315,225))
        self.image_label.setScaledContents(True)
        
        #надпись dashboard на графике
        dashboard_label = QtWidgets.QLabel("Dashboard", self)
        dashboard_label.setGeometry(QtCore.QRect(20, 40, 315, 40))
        dashboard_label.setMargin(10)

        dashboard_label.setAlignment(QtCore.Qt.AlignCenter)
        dashboard_label.setFont(QtGui.QFont('JetBrains Mono', 18))
        dashboard_label.setStyleSheet("color:black; background-color: white; ")


        #"tip of the day" block
        tip_block_label = QtWidgets.QLabel("for", self)
        tip_block_label.setGeometry(QtCore.QRect(350, 215, 330, 90))
        tip_block_label.setMargin(10)

        tip_block_label.setAlignment(QtCore.Qt.AlignCenter)
        tip_block_label.setFont(QtGui.QFont('JetBrains Mono', 1))
        tip_block_label.setStyleSheet("color:#B26868; background-color: #B26868; border-radius: 15px; ")

        #"tip of the day" head text
        tip_text_label = QtWidgets.QLabel("Совет дня:", self)
        tip_text_label.setGeometry(QtCore.QRect(263, 187, 330, 90))
        tip_text_label.setMargin(10)

        tip_text_label.setAlignment(QtCore.Qt.AlignCenter)
        tip_text_label.setFont(QtGui.QFont('JetBrains Mono', 12))
        tip_text_label.setStyleSheet("color:white; text-decoration: underline;")

        # "tip" itself
        tip_label = QtWidgets.QLabel("Рекомендуется раз в 20 минут\nсовершать зарядку для глаз. \n "
                                     "Это снизит усталость зрачков.", self)
        tip_label.setGeometry(QtCore.QRect(350, 175, 330, 190))
        tip_label.setMargin(10)

        tip_label.setAlignment(QtCore.Qt.AlignCenter)
        tip_label.setFont(QtGui.QFont('JetBrains Mono', 10))
        tip_label.setStyleSheet("color:white;")

        #lamp icon
        self.lamp = QtWidgets.QLabel(self)
        self.lamp.setText("")
        self.lamp.setTextFormat(QtCore.Qt.TextFormat.MarkdownText)
        self.lamp.setGeometry(QtCore.QRect(355, 220, 25, 25))
        self.lamp.setPixmap(QtGui.QPixmap("img/lamp.png"))  # на маке jpeg!
        self.lamp.setScaledContents(True)
        self.lamp.setWordWrap(False)
        self.lamp.setOpenExternalLinks(False)
        self.lamp.setObjectName("label")


        # "Average" block
        average_block = QtWidgets.QLabel("for", self)
        average_block.setGeometry(QtCore.QRect(350, 40, 330, 170))
        average_block.setMargin(10)
        average_block.setAlignment(QtCore.Qt.AlignCenter)
        average_block.setFont(QtGui.QFont('JetBrains Mono', 1))
        average_block.setStyleSheet("color:#1E2C20; background-color: #1E2C20; border-radius: 15px; ")

        # "Average" text
        average_text = QtWidgets.QLabel("Average", self)
        average_text.setGeometry(QtCore.QRect(445, 30, 140, 60))
        average_text.setMargin(10)

        average_text.setAlignment(QtCore.Qt.AlignCenter)
        average_text.setFont(QtGui.QFont('JetBrains Mono', 16))
        average_text.setStyleSheet("color:white; text-decoration: underline;")

        #average white block1 (left)
        white_block1 = QtWidgets.QLabel("for", self)
        white_block1.setGeometry(QtCore.QRect(370, 85, 135, 100))
        white_block1.setMargin(10)
        white_block1.setAlignment(QtCore.Qt.AlignCenter)
        white_block1.setFont(QtGui.QFont('JetBrains Mono', 1))
        white_block1.setStyleSheet("color: white ; background-color: white; border-radius: 15px; ")

        #average white block2 (right)
        white_block2 = QtWidgets.QLabel("for", self)
        white_block2.setGeometry(QtCore.QRect(525, 85, 135, 100))
        white_block2.setMargin(10)
        white_block2.setAlignment(QtCore.Qt.AlignCenter)
        white_block2.setFont(QtGui.QFont('JetBrains Mono', 1))
        white_block2.setStyleSheet("color: white ; background-color: white; border-radius: 15px; ")

        # "This week" text
        this_week = QtWidgets.QLabel("This week", self)
        this_week.setGeometry(QtCore.QRect(365, 70, 140, 60))
        this_week.setMargin(10)

        this_week.setAlignment(QtCore.Qt.AlignCenter)
        this_week.setFont(QtGui.QFont('JetBrains Mono', 11))
        this_week.setStyleSheet("color:black; text-decoration: underline;")

        # "This week" num
        this_week = QtWidgets.QLabel("7", self)
        this_week.setGeometry(QtCore.QRect(365, 105, 140, 60))
        this_week.setMargin(10)

        this_week.setAlignment(QtCore.Qt.AlignCenter)
        this_week.setFont(QtGui.QFont('JetBrains Mono', 22))
        this_week.setStyleSheet("color:black;")

        # "This day" text
        this_day = QtWidgets.QLabel("This day", self)
        this_day.setGeometry(QtCore.QRect(520, 70, 140, 60))
        this_day.setMargin(10)

        this_day.setAlignment(QtCore.Qt.AlignCenter)
        this_day.setFont(QtGui.QFont('JetBrains Mono', 11))
        this_day.setStyleSheet("color:black; text-decoration: underline;")

        # "This day" num
        this_week = QtWidgets.QLabel("5", self)
        this_week.setGeometry(QtCore.QRect(523, 105, 140, 60))
        this_week.setMargin(10)

        this_week.setAlignment(QtCore.Qt.AlignCenter)
        this_week.setFont(QtGui.QFont('JetBrains Mono', 22))
        this_week.setStyleSheet("color:black;")

        # "Times/day" text
        times_day = QtWidgets.QLabel("times/day", self)
        times_day.setGeometry(QtCore.QRect(523, 140, 140, 60))
        times_day.setMargin(10)

        times_day.setAlignment(QtCore.Qt.AlignCenter)
        times_day.setFont(QtGui.QFont('JetBrains Mono', 10))
        times_day.setStyleSheet("color:black;")

        times_day1 = QtWidgets.QLabel("times/day", self)
        times_day1.setGeometry(QtCore.QRect(365, 140, 140, 60))
        times_day1.setMargin(10)

        times_day1.setAlignment(QtCore.Qt.AlignCenter)
        times_day1.setFont(QtGui.QFont('JetBrains Mono', 10))
        times_day1.setStyleSheet("color:black;")

        



    def changer_to_start(self):
        self.start_button.hide()
        self.stop_button.show()

    def changer_to_stop(self):
        self.start_button.show()
        self.stop_button.hide()

    def start_detection(self):
        if hasattr(self, 'detection_thread') and self.detection_thread.isRunning():
            return  
        self.stop_flag = Value('i', 0)  
        self.detection_thread = DetectionThread(self.stop_flag)
        self.detection_thread.start()
        self.detection_thread.finished_signal.connect(self.on_detection_finished)
        self.start_button.setEnabled(False)
        self.stop_button.setEnabled(True)

    def stop_detection(self):
        if hasattr(self, 'stop_flag') and hasattr(self, 'detection_thread'):
            self.stop_flag.value = 1  
            self.detection_thread.wait()  
            self.detection_thread.quit()  
            
            self.start_button.setEnabled(True)
            self.stop_button.setEnabled(False)

    def on_detection_finished(self):
        
        print("Детекция завершена!")
        self.start_button.setEnabled(True)
        self.stop_button.setEnabled(False)

class MainApp(QtWidgets.QMainWindow):
    def __init__(self):
        super(MainApp, self).__init__()
        self.ui = Ui_test()
        self.ui.setupUi(self)
        self.home_page = HomePage()
        self.ui.pushButton.clicked.connect(self.check_access_key)

    def check_access_key(self):
        input_text = self.ui.lineEdit.text().strip() 
        if not input_text:
            self.ui.statusLabel.setText("Введите ключ доступа")
            return
        elif input_text == '123': #фиксированный код
            self.switch_to_home_page()
        url = "http://127.0.0.1:8000/check_key"  # URL сервера
        try:
            response = requests.post(url, json={"key": input_text})  
            if response.status_code == 200:
                result = response.json()
                if result.get("status") == "valid":
                    
                    self.switch_to_home_page()
                else:
                    self.ui.statusLabel.setText("повтор")
            else:
                self.ui.statusLabel.setText("Ключ введен неправильно, попробуйте еще раз")
        except requests.exceptions.RequestException as e:
            self.ui.statusLabel.setText("ошибка сервера")

    def switch_to_home_page(self):
        
        self.ui.label.hide()
        self.ui.lineEdit.hide()
        self.ui.pushButton.hide()
        self.ui.statusLabel.hide()
        
        self.setCentralWidget(self.home_page)  
        self.home_page.show()

if __name__ == "__main__":
    app = QtWidgets.QApplication(sys.argv)
    window = MainApp()
    window.show()
    sys.exit(app.exec_())