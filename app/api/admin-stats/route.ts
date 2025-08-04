import { NextRequest, NextResponse } from "next/server";
import { dataManager } from "@/lib/data-manager";

export async function GET(_request: NextRequest) {
  try {
    // Get all signups and admin users
    const signups = await dataManager.getSignups();
    const adminUsers = await dataManager.getAdminUsers();
    
    // Calculate statistics
    let totalSignups = signups.length;
    let waitlistedUsers = 0;
    let approvedUsers = 0;
    let premiumUsers = 0;
    let paidUsers = 0;
    let ambassadorReferrals = 0;
    let controllerAssignments = 0;
    
    // Maps to track stats per ambassador
    const ambassadorStats = new Map();
    const controllerStats = new Map();
    
    // Initialize stats for all ambassadors and controllers
    adminUsers.forEach(user => {
      if (user.role === 'ambassador') {
        ambassadorStats.set(user.id, {
          signups: 0,
          conversions: 0
        });
      } else if (user.role === 'controller') {
        controllerStats.set(user.id, {
          assignments: 0,
          completed: 0
        });
      }
    });
    
    // Process signups
    signups.forEach(signup => {
      const planType = signup.planType?.toLowerCase() || 'free';
      const status = signup.status?.toLowerCase() || 'waitlisted';
      const paymentStatus = signup.paymentStatus?.toLowerCase() || 'n/a';
      
      // Count paid users
      if (paymentStatus === 'paid' || paymentStatus === 'subscription') {
        paidUsers++;
      }
      
      // Count premium users
      if (planType === 'elite' || planType === 'pro' || planType === 'premium' || planType === 'paid') {
        premiumUsers++;
      }
      
      // Count waitlisted users
      if (planType === 'free' && (status === 'waitlisted' || status === 'pending')) {
        waitlistedUsers++;
      }
      
      // Count approved users
      if (planType === 'free' && status === 'approved') {
        approvedUsers++;
      }
      
      // Count ambassador referrals
      const referredBy = signup.referredBy || signup.ambassadorId;
      if (referredBy) {
        ambassadorReferrals++;
        
        // Update ambassador stats
        const stats = ambassadorStats.get(referredBy);
        if (stats) {
          stats.signups++;
          if (paymentStatus === 'paid' || paymentStatus === 'subscription') {
            stats.conversions++;
          }
        }
      }
      
      // Count controller assignments
      if (signup.processedBy) {
        controllerAssignments++;
        
        // Update controller stats
        const stats = controllerStats.get(signup.processedBy);
        if (stats) {
          stats.assignments++;
          if (status === 'approved') {
            stats.completed++;
          }
        }
      }
    });
    
    // Update admin user stats
    for (const user of adminUsers) {
      if (user.role === 'ambassador') {
        const stats = ambassadorStats.get(user.id);
        if (stats) {
          await dataManager.updateAdminUser(user.id, {
            stats: {
              ...user.stats,
              signups: stats.signups,
              conversions: stats.conversions
            }
          });
        }
      } else if (user.role === 'controller') {
        const stats = controllerStats.get(user.id);
        if (stats) {
          await dataManager.updateAdminUser(user.id, {
            stats: {
              ...user.stats,
              assignments: stats.assignments,
              completed: stats.completed
            }
          });
        }
      }
    }
    
    // Get updated stats
    const stats = await dataManager.getStats();
    
    // Return comprehensive stats
    return NextResponse.json({
      overall: {
        totalSignups: stats.totalSignups,
        waitlistedUsers: stats.waitlistedUsers,
        approvedUsers: stats.approvedUsers,
        premiumUsers: stats.premiumUsers,
        paidUsers: stats.paidUsers,
        ambassadorReferrals: stats.ambassadorReferrals,
        controllerAssignments: stats.controllerAssignments
      },
      adminStats: {
        totalControllers: stats.totalControllers,
        totalAmbassadors: stats.totalAmbassadors
      },
      trends: {
        conversionRate: totalSignups > 0 ? (paidUsers / totalSignups * 100).toFixed(1) : "0.0",
        approvalRate: waitlistedUsers > 0 ? (approvedUsers / (waitlistedUsers + approvedUsers) * 100).toFixed(1) : "0.0",
        ambassadorEffectiveness: ambassadorReferrals > 0 ? (paidUsers / ambassadorReferrals * 100).toFixed(1) : "0.0"
      },
      signups: signups // Include signups data for detailed stats calculations
    });

  } catch (error) {
    console.error("Error fetching admin stats:", error);
    return NextResponse.json(
      { error: "Internal server error" },
      { status: 500 }
    );
  }
}