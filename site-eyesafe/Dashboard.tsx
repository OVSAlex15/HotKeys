import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Navbar from '@/components/Navbar';
import { 
  Tabs, 
  TabsContent, 
  TabsList, 
  TabsTrigger 
} from '@/components/ui/tabs';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  User, 
  CreditCard, 
  BarChart3, 
  Settings, 
  Shield, 
  Download,
  LogOut,
  Check,
  Clock,
  Activity,
  Eye,
  AlertTriangle,
  Zap,
  Calendar,
  KeyRound,
  Copy
} from 'lucide-react';
import { Progress } from '@/components/ui/progress';
import { useToast } from '@/hooks/use-toast';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState("overview");
  const [userCode, setUserCode] = useState<string | null>(null);

  // This would come from your authentication provider in a real app
  const user = {
    name: "Alex Johnson",
    email: "alex@example.com",
    plan: "Pro",
    nextBilling: "June 15, 2023",
    usageStats: {
      screenTime: 6.2, // hours
      breaksCount: 7,
      postureFixes: 12,
      eyeDistanceAlerts: 8
    },
    weeklyStats: [65, 70, 80, 72, 78, 75, 82],
    installedDevices: [
      { name: "Work Laptop", lastActive: "Today, 2:30 PM" },
      { name: "Home PC", lastActive: "Yesterday, 8:15 PM" }
    ]
  };

  const handleLogout = () => {
    toast({
      title: "Logged out successfully",
      description: "You have been logged out of your account.",
    });
    navigate('/');
  };

  const handleDownload = () => {
    toast({
      title: "Download initiated",
      description: "Your download should begin shortly.",
    });
  };

  const generateUniqueCode = () => {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let code = '';
    
    for (let i = 0; i < 12; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      code += characters.charAt(randomIndex);
    }
    
    setUserCode(code);
    
    toast({
      title: "Unique code generated",
      description: "Your unique code has been created successfully.",
    });
  };

  const copyCodeToClipboard = () => {
    if (userCode) {
      navigator.clipboard.writeText(userCode);
      
      toast({
        title: "Code copied",
        description: "Your unique code has been copied to clipboard.",
      });
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Navbar />
      
      <main className="flex-grow py-8 page-transition">
        <div className="container px-4 md:px-6">
          <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
            <div>
              <h1 className="text-3xl font-bold">Dashboard</h1>
              <p className="text-gray-500">Welcome back, {user.name}</p>
            </div>
            
            <div className="mt-4 md:mt-0 flex flex-col sm:flex-row gap-3">
              <Button variant="outline" size="sm" onClick={handleDownload}>
                <Download className="mr-2 h-4 w-4" />
                Download App
              </Button>
              <Button variant="outline" size="sm" onClick={handleLogout}>
                <LogOut className="mr-2 h-4 w-4" />
                Sign Out
              </Button>
            </div>
          </div>
          
          <Tabs defaultValue="overview" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-5 md:grid-cols-5 mb-8">
              <TabsTrigger value="overview" className="flex items-center gap-2">
                <BarChart3 className="h-4 w-4" />
                <span className="hidden md:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="subscription" className="flex items-center gap-2">
                <CreditCard className="h-4 w-4" />
                <span className="hidden md:inline">Subscription</span>
              </TabsTrigger>
              <TabsTrigger value="devices" className="flex items-center gap-2">
                <Shield className="h-4 w-4" />
                <span className="hidden md:inline">Devices</span>
              </TabsTrigger>
              <TabsTrigger value="activation" className="flex items-center gap-2">
                <KeyRound className="h-4 w-4" />
                <span className="hidden md:inline">Activation</span>
              </TabsTrigger>
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden md:inline">Profile</span>
              </TabsTrigger>
            </TabsList>
            
            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Screen Time Today</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Clock className="h-5 w-5 text-primary mr-2" />
                      <span className="text-2xl font-bold">{user.usageStats.screenTime}h</span>
                    </div>
                    <Progress value={user.usageStats.screenTime * 10} className="h-1 mt-4" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Breaks Taken</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Zap className="h-5 w-5 text-primary mr-2" />
                      <span className="text-2xl font-bold">{user.usageStats.breaksCount}</span>
                    </div>
                    <Progress value={user.usageStats.breaksCount * 10} className="h-1 mt-4" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Posture Fixes</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Activity className="h-5 w-5 text-primary mr-2" />
                      <span className="text-2xl font-bold">{user.usageStats.postureFixes}</span>
                    </div>
                    <Progress value={user.usageStats.postureFixes * 5} className="h-1 mt-4" />
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-sm font-medium text-gray-500">Eye Distance Alerts</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="flex items-center">
                      <Eye className="h-5 w-5 text-primary mr-2" />
                      <span className="text-2xl font-bold">{user.usageStats.eyeDistanceAlerts}</span>
                    </div>
                    <Progress value={user.usageStats.eyeDistanceAlerts * 8} className="h-1 mt-4" />
                  </CardContent>
                </Card>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Weekly Vision Health Score</CardTitle>
                    <CardDescription>Your progress over the last 7 days</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="h-[200px] flex items-end gap-2">
                      {user.weeklyStats.map((value, index) => (
                        <div 
                          key={index} 
                          className="flex-1 bg-primary/10 rounded-t-md relative group"
                          style={{ height: `${value}%` }}
                        >
                          <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 bg-primary text-white text-xs py-1 px-2 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                            {value}%
                          </div>
                        </div>
                      ))}
                    </div>
                    <div className="flex justify-between mt-2 text-xs text-gray-500">
                      <span>Mon</span>
                      <span>Tue</span>
                      <span>Wed</span>
                      <span>Thu</span>
                      <span>Fri</span>
                      <span>Sat</span>
                      <span>Sun</span>
                    </div>
                  </CardContent>
                </Card>
                
                <Card>
                  <CardHeader>
                    <CardTitle>Recent Notifications</CardTitle>
                    <CardDescription>Vision protection alerts from today</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {[
                        { 
                          icon: AlertTriangle, 
                          color: "text-orange-500", 
                          message: "You were too close to the screen for 10 minutes", 
                          time: "2 hours ago" 
                        },
                        { 
                          icon: Activity, 
                          color: "text-red-500", 
                          message: "Poor posture detected during your last session", 
                          time: "3 hours ago" 
                        },
                        { 
                          icon: Clock, 
                          color: "text-blue-500", 
                          message: "Time for a short break to rest your eyes", 
                          time: "5 hours ago" 
                        },
                        { 
                          icon: Zap, 
                          color: "text-green-500", 
                          message: "Great job! You maintained proper distance for 1 hour", 
                          time: "6 hours ago" 
                        }
                      ].map((notification, index) => (
                        <div key={index} className="flex items-start">
                          <div className={`mt-0.5 mr-3 ${notification.color}`}>
                            <notification.icon className="h-5 w-5" />
                          </div>
                          <div>
                            <p className="text-sm">{notification.message}</p>
                            <p className="text-xs text-gray-500">{notification.time}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </div>
              
              <Card>
                <CardHeader>
                  <CardTitle>Upcoming Schedules</CardTitle>
                  <CardDescription>Your vision protection plan for today</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {[
                      { 
                        icon: Calendar, 
                        title: "20-20-20 Rule Reminder", 
                        description: "Every 20 minutes, look at something 20 feet away for 20 seconds",
                        time: "Every 20 minutes" 
                      },
                      { 
                        icon: Clock, 
                        title: "Scheduled Break", 
                        description: "Take a 5-minute break from screen time to reduce eye strain",
                        time: "In 45 minutes" 
                      },
                      { 
                        icon: Activity, 
                        title: "Posture Check", 
                        description: "Reminder to check and correct your sitting posture",
                        time: "Every hour" 
                      }
                    ].map((schedule, index) => (
                      <div key={index} className="flex items-start pb-4 border-b last:border-0 last:pb-0">
                        <div className="mt-0.5 mr-4 p-2 bg-primary/10 rounded-full text-primary">
                          <schedule.icon className="h-5 w-5" />
                        </div>
                        <div>
                          <h4 className="text-sm font-medium">{schedule.title}</h4>
                          <p className="text-xs text-gray-500 mt-1">{schedule.description}</p>
                          <p className="text-xs font-medium text-primary mt-2">{schedule.time}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="subscription" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Current Plan</CardTitle>
                  <CardDescription>Your subscription details and billing information</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-primary/10 rounded-xl p-6 relative overflow-hidden">
                      <div className="absolute top-0 right-0 p-2 bg-primary text-white text-xs font-medium rounded-bl-lg">
                        Active
                      </div>
                      
                      <h3 className="text-2xl font-bold text-primary">{user.plan} Plan</h3>
                      <p className="text-sm text-gray-500 mt-1">Billed monthly</p>
                      
                      <div className="mt-6">
                        <p className="text-sm text-gray-700">Next billing date: <span className="font-medium">{user.nextBilling}</span></p>
                      </div>
                      
                      <div className="mt-6 space-y-2">
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm">Advanced eye distance tracking</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm">Comprehensive posture monitoring</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm">Detailed lighting analysis</span>
                        </div>
                        <div className="flex items-center">
                          <Check className="h-5 w-5 text-green-500 mr-2" />
                          <span className="text-sm">Up to 3 devices</span>
                        </div>
                      </div>
                      
                      <div className="mt-6 flex gap-3">
                        <Button variant="outline" size="sm">
                          Cancel Subscription
                        </Button>
                        <Button size="sm">
                          Upgrade to Premium
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Payment Method</h3>
                      <div className="flex items-center p-4 border rounded-lg">
                        <div className="p-2 bg-gray-100 rounded-md mr-4">
                          <CreditCard className="h-6 w-6 text-gray-500" />
                        </div>
                        <div>
                          <p className="font-medium">Visa ending in 4242</p>
                          <p className="text-sm text-gray-500">Expires 12/25</p>
                        </div>
                        <Button variant="link" className="ml-auto" size="sm">
                          Update
                        </Button>
                      </div>
                    </div>
                    
                    <div>
                      <h3 className="text-lg font-semibold mb-4">Billing History</h3>
                      <div className="rounded-lg border overflow-hidden">
                        <table className="w-full">
                          <thead className="bg-gray-50">
                            <tr>
                              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Date</th>
                              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Amount</th>
                              <th className="text-left px-4 py-3 text-sm font-medium text-gray-500">Status</th>
                              <th className="text-right px-4 py-3 text-sm font-medium text-gray-500">Receipt</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y">
                            {[
                              { date: "May 15, 2023", amount: "$5.99", status: "Paid" },
                              { date: "Apr 15, 2023", amount: "$5.99", status: "Paid" },
                              { date: "Mar 15, 2023", amount: "$5.99", status: "Paid" }
                            ].map((invoice, index) => (
                              <tr key={index}>
                                <td className="px-4 py-3 text-sm">{invoice.date}</td>
                                <td className="px-4 py-3 text-sm">{invoice.amount}</td>
                                <td className="px-4 py-3 text-sm">
                                  <span className="inline-flex items-center rounded-full px-2 py-1 text-xs font-medium bg-green-100 text-green-700">
                                    {invoice.status}
                                  </span>
                                </td>
                                <td className="px-4 py-3 text-sm text-right">
                                  <Button variant="link" size="sm" className="h-auto p-0">
                                    Download
                                  </Button>
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="devices" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Connected Devices</CardTitle>
                  <CardDescription>Manage the devices connected to your Eyesafe account</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {user.installedDevices.map((device, index) => (
                      <div key={index} className="flex items-start justify-between border-b pb-4 last:border-0 last:pb-0">
                        <div className="flex items-center">
                          <div className="p-3 bg-primary/10 rounded-full mr-4">
                            <Shield className="h-5 w-5 text-primary" />
                          </div>
                          <div>
                            <h4 className="font-medium">{device.name}</h4>
                            <p className="text-sm text-gray-500">Last active: {device.lastActive}</p>
                          </div>
                        </div>
                        <Button variant="outline" size="sm">
                          Disconnect
                        </Button>
                      </div>
                    ))}
                    
                    <Button className="w-full">
                      <Download className="mr-2 h-4 w-4" />
                      Install on Another Device
                    </Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card>
                <CardHeader>
                  <CardTitle>Device Settings</CardTitle>
                  <CardDescription>Configure your protection settings for all devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    {[
                      {
                        title: "Eye Distance Sensitivity",
                        description: "How quickly Eyesafe alerts you when too close to the screen",
                        options: ["Low", "Medium", "High"],
                        selected: 1
                      },
                      {
                        title: "Posture Detection Sensitivity",
                        description: "How sensitive the posture detection should be",
                        options: ["Low", "Medium", "High"],
                        selected: 2
                      },
                      {
                        title: "Lighting Recommendations",
                        description: "How often Eyesafe suggests lighting changes",
                        options: ["Rarely", "Occasionally", "Frequently"],
                        selected: 1
                      }
                    ].map((setting, index) => (
                      <div key={index} className="pb-6 border-b last:border-0 last:pb-0">
                        <div className="mb-4">
                          <h4 className="font-medium">{setting.title}</h4>
                          <p className="text-sm text-gray-500">{setting.description}</p>
                        </div>
                        <div className="flex gap-2">
                          {setting.options.map((option, optIndex) => (
                            <Button
                              key={optIndex}
                              variant={optIndex === setting.selected ? "default" : "outline"}
                              size="sm"
                            >
                              {option}
                            </Button>
                          ))}
                        </div>
                      </div>
                    ))}
                    
                    <div className="flex justify-end">
                      <Button>Save Settings</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="activation" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Device Activation</CardTitle>
                  <CardDescription>Generate a unique code to activate Eyesafe on your devices</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="bg-primary/10 rounded-xl p-6 relative overflow-hidden">
                      <h3 className="text-xl font-bold mb-4">Your Unique Activation Code</h3>
                      
                      {userCode ? (
                        <div className="flex flex-col space-y-4">
                          <div className="bg-white p-4 rounded-lg border flex items-center justify-between">
                            <span className="font-mono text-lg tracking-wide">{userCode}</span>
                            <Button variant="ghost" size="sm" onClick={copyCodeToClipboard}>
                              <Copy className="h-4 w-4" />
                              <span className="sr-only">Copy to clipboard</span>
                            </Button>
                          </div>
                          <p className="text-sm text-gray-500">
                            This code can be used to activate Eyesafe on your devices. 
                            For security reasons, don't share this code with anyone.
                          </p>
                          <Button onClick={generateUniqueCode}>
                            Generate New Code
                          </Button>
                        </div>
                      ) : (
                        <div className="flex flex-col space-y-4">
                          <p className="text-sm text-gray-500">
                            Generate a unique 12-character code to activate Eyesafe on your devices.
                            Each code is linked to your account and can be used for authentication.
                          </p>
                          <Button onClick={generateUniqueCode}>
                            <KeyRound className="mr-2 h-4 w-4" />
                            Generate Activation Code
                          </Button>
                        </div>
                      )}
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="text-lg font-semibold">How to Use Your Activation Code</h3>
                      <ol className="space-y-3 list-decimal list-inside text-gray-700">
                        <li>Download and install Eyesafe on your device</li>
                        <li>Open the application and click on "Activate with Code"</li>
                        <li>Enter the 12-character activation code shown above</li>
                        <li>Your device will be linked to your account automatically</li>
                      </ol>
                    </div>
                    
                    <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                      <div className="flex items-start">
                        <Eye className="text-blue-500 mt-1 mr-3 h-5 w-5" />
                        <div>
                          <h4 className="font-medium text-blue-900">Device Limit Notice</h4>
                          <p className="text-sm text-blue-800 mt-1">
                            Your current {user.plan} plan allows activation on up to 3 devices.
                            To increase this limit, consider upgrading your subscription.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="profile" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Personal Information</CardTitle>
                  <CardDescription>Manage your account details and preferences</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-6">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4 pb-6 border-b">
                      <div className="h-20 w-20 rounded-full bg-primary/10 flex items-center justify-center text-primary text-2xl font-bold">
                        {user.name.split(' ').map(n => n[0]).join('')}
                      </div>
                      
                      <div className="space-y-1">
                        <h3 className="font-semibold text-lg">{user.name}</h3>
                        <p className="text-sm text-gray-500">{user.email}</p>
                        <p className="text-sm text-primary">{user.plan} Plan</p>
                      </div>
                      
                      <Button variant="outline" size="sm" className="sm:ml-auto">
                        <User className="mr-2 h-4 w-4" />
                        Edit Profile
                      </Button>
                    </div>
                    
                    <div className="space-y-4">
                      <h3 className="font-semibold text-lg">Account Settings</h3>
                      
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                          <label className="block text-sm font-medium mb-2">Email Address</label>
                          <Input value={user.email} readOnly className="bg-gray-50" />
                        </div>
                        
                        <div>
                          <label className="block text-sm font-medium mb-2">Full Name</label>
                          <Input value={user.name} readOnly className="bg-gray-50" />
                        </div>
                      </div>
                      
                      <div className="pt-4">
                        <Button variant="outline" size="sm">
                          Change Password
                        </Button>
                      </div>
                    </div>
                    
                    <div className="space-y-4 pt-4">
                      <h3 className="font-semibold text-lg">Notification Preferences</h3>
                      
                      <div className="space-y-4">
                        {[
                          "Email me about product updates and features",
                          "Email me about tips to improve my vision health",
                          "Email me about special offers and promotions",
                          "Allow desktop notifications for eye strain reminders",
                          "Allow desktop notifications for posture corrections"
                        ].map((pref, index) => (
                          <div key={index} className="flex items-center justify-between">
                            <label className="text-sm">{pref}</label>
                            <Switch checked={index < 3} />
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    <div className="pt-4 flex justify-end">
                      <Button>Save Changes</Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-destructive/50">
                <CardHeader>
                  <CardTitle className="text-destructive">Danger Zone</CardTitle>
                  <CardDescription>
                    Irreversible and destructive actions
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="border rounded-lg p-4">
                      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                        <div>
                          <h4 className="font-medium">Delete Account</h4>
                          <p className="text-sm text-gray-500">
                            Permanently delete your account and all associated data
                          </p>
                        </div>
                        <Button variant="destructive" size="sm">
                          Delete Account
                        </Button>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </main>
      
      <footer className="bg-white border-t py-6">
        <div className="container px-4 md:px-6 text-center">
          <p className="text-sm text-gray-500">
            © {new Date().getFullYear()} Eyesafe. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

const Switch = ({ checked = false }) => {
  const [isChecked, setIsChecked] = useState(checked);
  
  return (
    <button
      type="button"
      role="switch"
      aria-checked={isChecked}
      className={`relative inline-flex h-5 w-10 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 ${
        isChecked ? 'bg-primary' : 'bg-gray-200'
      }`}
      onClick={() => setIsChecked(!isChecked)}
    >
      <span className="sr-only">Use setting</span>
      <span
        className={`pointer-events-none relative inline-block h-4 w-4 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
          isChecked ? 'translate-x-5' : 'translate-x-0'
        }`}
      />
    </button>
  );
};

const Input = ({ className, ...props }) => {
  return (
    <input
      className={`flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 ${className}`}
      {...props}
    />
  );
};

export default Dashboard;
