-- SQL Query to show ALL players regardless of status (waitlisted, rejected, approved, or paid)

SELECT 
    -- Basic Info
    id,
    first_name,
    last_name,
    full_name,
    email,
    phone,
    
    -- Demographics
    age,
    birthday,
    gender,
    location,
    
    -- Football Background
    played_before,
    experience_level,
    played_club,
    club_name,
    position,
    goal,
    why_join,
    why_join_reason,
    
    -- Status & Plan Info
    status,
    plan_type,
    payment_status,
    amount,
    currency,
    billing,
    
    -- Assignment & Referral Info
    referred_by,
    assigned_to,
    ambassador_id,
    processed_by,
    payment_id,
    
    -- Timestamps
    timestamp,
    created_at,
    updated_at,
    
    -- Helpful computed fields
    CASE 
        WHEN plan_type = 'free' AND status = 'waitlisted' THEN 'Free - Waitlisted'
        WHEN plan_type = 'free' AND status = 'approved' THEN 'Free - Approved'
        WHEN plan_type = 'free' AND status = 'rejected' THEN 'Free - Rejected'
        WHEN plan_type IN ('elite', 'pro', 'premium') AND payment_status = 'paid' THEN 'Paid Member - ' || UPPER(plan_type)
        WHEN plan_type IN ('elite', 'pro', 'premium') AND payment_status != 'paid' THEN 'Pending Payment - ' || UPPER(plan_type)
        ELSE 'Other - ' || status
    END AS player_category,
    
    CASE 
        WHEN has_disability = 'true' THEN 'Yes'
        WHEN has_disability = 'false' THEN 'No'
        ELSE 'Not specified'
    END AS has_disability_readable

FROM signups 

-- Order by most recent first, then by status priority
ORDER BY 
    created_at DESC,
    CASE status
        WHEN 'approved' THEN 1
        WHEN 'waitlisted' THEN 2
        WHEN 'rejected' THEN 3
        ELSE 4
    END,
    plan_type DESC,
    last_name,
    first_name;

-- Alternative queries for specific views:

-- 1. Simple overview (just essential info)
/*
SELECT 
    first_name,
    last_name,
    email,
    status,
    plan_type,
    payment_status,
    location,
    experience_level,
    created_at
FROM signups 
ORDER BY created_at DESC;
*/

-- 2. Count by status and plan type
/*
SELECT 
    status,
    plan_type,
    payment_status,
    COUNT(*) as player_count
FROM signups 
GROUP BY status, plan_type, payment_status
ORDER BY status, plan_type;
*/

-- 3. All paid members only
/*
SELECT 
    first_name,
    last_name,
    email,
    plan_type,
    amount,
    currency,
    payment_status,
    created_at
FROM signups 
WHERE plan_type IN ('elite', 'pro', 'premium') 
   OR payment_status = 'paid'
ORDER BY created_at DESC;
*/

-- 4. All free players (waitlisted, approved, rejected)
/*
SELECT 
    first_name,
    last_name,
    email,
    status,
    assigned_to,
    processed_by,
    created_at
FROM signups 
WHERE plan_type = 'free'
ORDER BY 
    CASE status
        WHEN 'approved' THEN 1
        WHEN 'waitlisted' THEN 2
        WHEN 'rejected' THEN 3
    END,
    created_at DESC;
*/