<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <style>
        body {
            font-family: 'Helvetica Neue', Helvetica, Arial, sans-serif;
            line-height: 1.6;
            color: #333333;
            background-color: #f4f4f4;
            margin: 0;
            padding: 0;
            -webkit-font-smoothing: antialiased;
        }
        .container {
            max-width: 600px;
            margin: 20px auto;
            background: #ffffff;
            border-radius: 8px;
            overflow: hidden;
            box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .header {
            background-color: #2c3e50;
            color: #ffffff;
            padding: 20px;
            text-align: center;
        }
        .header h1 {
            margin: 0;
            font-size: 24px;
            font-weight: 600;
        }
        .content {
            padding: 30px;
            background-color: #ffffff;
        }
        .status-badge {
            display: inline-block;
            padding: 8px 16px;
            border-radius: 50px;
            font-weight: bold;
            font-size: 14px;
            text-transform: uppercase;
            letter-spacing: 1px;
            margin: 10px 0;
        }
        .approved {
            background-color: #d4edda;
            color: #155724;
            border: 1px solid #c3e6cb;
        }
        .rejected {
            background-color: #f8d7da;
            color: #721c24;
            border: 1px solid #f5c6cb;
        }
        .details-box {
            background-color: #f8f9fa;
            border: 1px solid #e9ecef;
            border-radius: 6px;
            padding: 20px;
            margin: 20px 0;
        }
        .details-row {
            margin-bottom: 10px;
            padding-bottom: 10px;
            border-bottom: 1px solid #e9ecef;
        }
        .details-row:last-child {
            border-bottom: none;
            margin-bottom: 0;
            padding-bottom: 0;
        }
        .config-label {
            font-weight: bold;
            color: #6c757d;
            display: inline-block;
            width: 100px;
        }
        .btn-container {
            text-align: center;
            margin-top: 30px;
        }
        .btn {
            display: inline-block;
            padding: 12px 30px;
            background-color: #3490dc;
            color: #ffffff;
            text-decoration: none;
            border-radius: 5px;
            font-weight: bold;
            transition: background-color 0.3s;
        }
        .btn:hover {
            background-color: #2779bd;
        }
        .footer {
            background-color: #f8f9fa;
            text-align: center;
            padding: 20px;
            color: #6c757d;
            font-size: 12px;
            border-top: 1px solid #e9ecef;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <h1>Leave Request Notification</h1>
        </div>
        
        <div class="content">
            <p>Hello <strong>{{ $notifiable->name }}</strong>,</p>
            
            <p>Your leave request has been processed.</p>
            
            <div style="text-align: center;">
                <span class="status-badge {{ strtolower($leaveRequest->status) }}">
                    {{ ucfirst($leaveRequest->status) }}
                </span>
            </div>
            
            <div class="details-box">
                <div class="details-row">
                    <span class="config-label">Start Date:</span>
                    <span>{{ $leaveRequest->start_date }}</span>
                </div>
                <div class="details-row">
                    <span class="config-label">End Date:</span>
                    <span>{{ $leaveRequest->end_date }}</span>
                </div>
                <div class="details-row">
                    <span class="config-label">Reason:</span>
                    <span>{{ $leaveRequest->reason }}</span>
                </div>
            </div>

            <p>If you have any questions regarding this decision, please contact the HR department.</p>

            <div class="btn-container">
                <!-- Using inline style for button color text to ensure it works in all clients -->
                <a href="{{ $actionUrl }}" class="btn" style="color: #ffffff;">View Dashboard</a>
            </div>
        </div>

        <div class="footer">
            <p>&copy; {{ date('Y') }} {{ config('app.name') }}. All rights reserved.</p>
            <p>This is an automated message, please do not reply to this email.</p>
        </div>
    </div>
</body>
</html>
