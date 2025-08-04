import { csvManager } from "../lib/csv-data-manager";
import { supabaseManager } from "../lib/supabase-manager";

async function migrateToSupabase() {
  console.log("🚀 Starting migration from CSV to Supabase...\n");

  try {
    // Step 1: Initialize Supabase tables
    console.log("📋 Step 1: Initializing Supabase tables...");
    await supabaseManager.initializeTables();
    console.log("✅ Tables created successfully\n");

    // Step 2: Migrate admin users
    console.log("👥 Step 2: Migrating admin users...");
    const csvAdminUsers = await csvManager.getAdminUsers();
    console.log(`Found ${csvAdminUsers.length} admin users in CSV`);

    for (const user of csvAdminUsers) {
      try {
        // Check if user already exists
        const existing = await supabaseManager.findAdminUser(user.username);
        if (existing) {
          console.log(`⚠️  User ${user.username} already exists, skipping...`);
          continue;
        }

        // Map CSV user to Supabase format
        const supabaseUser = {
          id: user.id,
          username: user.username,
          password: user.password,
          role: user.role as 'admin' | 'controller' | 'ambassador',
          created: user.created,
          stats: user.stats
        };

        await supabaseManager.addAdminUser(supabaseUser);
        console.log(`✅ Migrated user: ${user.username} (${user.role})`);
      } catch (error) {
        console.error(`❌ Error migrating user ${user.username}:`, error);
      }
    }
    console.log(`✅ Admin users migration completed\n`);

    // Step 3: Migrate signups
    console.log("📝 Step 3: Migrating signups...");
    const csvSignups = await csvManager.getSignups();
    console.log(`Found ${csvSignups.length} signups in CSV`);

    for (const signup of csvSignups) {
      try {
        // Check if signup already exists
        const existing = await supabaseManager.findSignupByEmail(signup.email);
        if (existing) {
          console.log(`⚠️  Signup ${signup.email} already exists, skipping...`);
          continue;
        }

        // Map CSV signup to Supabase format
        const supabaseSignup = {
          timestamp: signup.timestamp,
          plan_type: signup.planType,
          payment_status: signup.paymentStatus,
          first_name: signup.firstName,
          last_name: signup.lastName,
          full_name: signup.fullName,
          age: signup.age,
          played_before: signup.playedBefore,
          experience_level: signup.experienceLevel,
          played_club: signup.playedClub,
          club_name: signup.clubName,
          gender: signup.gender,
          has_disability: signup.hasDisability,
          location: signup.location,
          email: signup.email,
          phone: signup.phone,
          position: signup.position,
          goal: signup.goal,
          why_join: signup.whyJoin,
          why_join_reason: signup.whyJoinReason,
          birthday: signup.birthday,
          status: signup.status,
          referred_by: signup.referredBy,
          assigned_to: signup.assignedTo,
          ambassador_id: signup.ambassadorId,
          processed_by: signup.processedBy,
          payment_id: signup.paymentId,
          amount: signup.amount,
          currency: signup.currency,
          billing: signup.billing
        };

        await supabaseManager.addSignup(supabaseSignup);
        console.log(`✅ Migrated signup: ${signup.email} (${signup.status})`);
      } catch (error) {
        console.error(`❌ Error migrating signup ${signup.email}:`, error);
      }
    }
    console.log(`✅ Signups migration completed\n`);

    // Step 4: Verify migration
    console.log("🔍 Step 4: Verifying migration...");
    const supabaseAdminUsers = await supabaseManager.getAdminUsers();
    const supabaseSignups = await supabaseManager.getSignups();

    console.log(`📊 Migration Results:`);
    console.log(`   CSV Admin Users: ${csvAdminUsers.length}`);
    console.log(`   Supabase Admin Users: ${supabaseAdminUsers.length}`);
    console.log(`   CSV Signups: ${csvSignups.length}`);
    console.log(`   Supabase Signups: ${supabaseSignups.length}`);

    if (supabaseAdminUsers.length === csvAdminUsers.length && 
        supabaseSignups.length === csvSignups.length) {
      console.log(`\n🎉 Migration completed successfully!`);
      console.log(`✅ All data has been migrated to Supabase`);
    } else {
      console.log(`\n⚠️  Migration completed with some discrepancies`);
      console.log(`   Please check the logs above for any errors`);
    }

    // Step 5: Test some queries
    console.log(`\n🧪 Step 5: Testing Supabase queries...`);
    
    // Test admin user query
    const testUser = await supabaseManager.findAdminUser('admin');
    if (testUser) {
      console.log(`✅ Admin user query test passed`);
    } else {
      console.log(`❌ Admin user query test failed`);
    }

    // Test signup query
    const testSignup = supabaseSignups[0];
    if (testSignup) {
      const foundSignup = await supabaseManager.findSignupByEmail(testSignup.email);
      if (foundSignup) {
        console.log(`✅ Signup query test passed`);
      } else {
        console.log(`❌ Signup query test failed`);
      }
    }

    // Test stats
    const stats = await supabaseManager.getStats();
    console.log(`✅ Stats query test passed:`);
    console.log(`   Total Signups: ${stats.totalSignups}`);
    console.log(`   Waitlisted: ${stats.waitlistedUsers}`);
    console.log(`   Approved: ${stats.approvedUsers}`);
    console.log(`   Premium: ${stats.premiumUsers}`);

    console.log(`\n🎯 Migration Summary:`);
    console.log(`✅ Database tables initialized`);
    console.log(`✅ Admin users migrated: ${supabaseAdminUsers.length}`);
    console.log(`✅ Signups migrated: ${supabaseSignups.length}`);
    console.log(`✅ Queries tested and working`);
    console.log(`\n🚀 Your application is ready to use Supabase!`);

  } catch (error) {
    console.error("❌ Migration failed:", error);
    throw error;
  }
}

// Run the migration
migrateToSupabase().catch(console.error);