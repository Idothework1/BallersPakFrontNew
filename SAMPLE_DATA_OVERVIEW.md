# Sample Data Overview

## Database Successfully Populated! 🎉

The database has been cleared and populated with comprehensive sample data that follows the system flow.

## Staff Accounts

### Admin
- **Username**: admin
- **Password**: admin123
- **Access**: Full system access

### Controllers (Can approve/reject assigned players)
1. **Controller 1**
   - Username: controller1
   - Password: controller123
   - Assigned Players: 3 (Emma, Michael, James-approved, Tom-rejected)
   - Completed: 2 (1 approved, 1 rejected)

2. **Controller 2**
   - Username: controller2  
   - Password: controller456
   - Assigned Players: 2 (Sophie, Oliver-approved, David-rejected)
   - Completed: 2 (1 approved, 1 rejected)

### Ambassadors (Can track referrals)
1. **Ambassador 1**
   - Username: ambassador1
   - Password: ambassador123
   - Total Signups: 3 (John, Emma, James, Tom)
   - Conversions: 1 (James approved)

2. **Ambassador 2**
   - Username: ambassador2
   - Password: ambassador456
   - Total Signups: 2 (Michael, Alexander-premium)
   - Conversions: 1 (Alexander premium)

## Player Data

### Sign Ups / Waitlisted (4 players)
1. **John Doe** - Referred by ambassador-1, not assigned yet
2. **Emma Wilson** - Referred by ambassador-1, assigned to controller-1 (pending)
3. **Michael Brown** - Referred by ambassador-2, assigned to controller-1 (pending)
4. **Sophie Taylor** - Direct signup, assigned to controller-2 (pending)

### Approved Members (2 players)
1. **James Smith** - Free member, approved by controller-1
2. **Oliver Jones** - Free member, approved by controller-2

### Premium Members (2 players)
1. **Alexander Martinez** - Elite Plan (£49.99/month)
2. **Isabella Garcia** - Pro Plan (£29.99/month)

### Rejected Players (2 players)
1. **Tom White** - Rejected by controller-1 (age over limit)
2. **David Clark** - Rejected by controller-2 (age over limit)

## System Flow Verification

### For Controllers:
1. Login with controller credentials
2. Dashboard shows assigned waitlisted players
3. Can approve or reject players
4. Stats update in real-time

### For Ambassadors:
1. Login with ambassador credentials
2. Dashboard shows referral stats
3. Can see signup conversions
4. Has unique referral link

### For Admin:
1. Can see all players across categories
2. Can assign waitlisted players to controllers
3. Can manage staff accounts
4. Full system visibility

## Testing the System

1. **Admin Dashboard** (http://localhost:3000/admin)
   - Login: admin/admin123
   - View all player categories
   - Assign waitlisted players to controllers

2. **Controller Dashboard** (http://localhost:3000/controller/dashboard)
   - Login: controller1/controller123 or controller2/controller456
   - See assigned players (Emma & Michael for controller1, Sophie for controller2)
   - Approve or reject pending players

3. **Ambassador Dashboard** (http://localhost:3000/ambassador/dashboard)
   - Login: ambassador1/ambassador123 or ambassador2/ambassador456
   - View referral statistics
   - Copy referral link for new signups

## Data Structure

All data is stored in CSV format:
- `/data/signups.csv` - All player data
- `/data/admin-users.csv` - Staff accounts

The system is fully Supabase-ready and uses the CSV manager for all operations.