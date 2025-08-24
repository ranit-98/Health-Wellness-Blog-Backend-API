import express from "express";
import cors from "cors";
import helmet from "helmet";
import morgan from "morgan";
import rateLimit from "express-rate-limit";
import swaggerUi from "swagger-ui-express";

// Import routes

import { connectDatabase } from "./config/database";
import { swaggerSpec } from "./config/swagger";
import { errorHandler } from "./middleware/error.middleware";
import authRoutes from "./routes/auth.routes";
import blogRoutes from "./routes/blog.routes";
import bookmarkRoutes from "./routes/bookmark.routes";
import categoryRoutes from "./routes/category.routes";
import newsletterRoutes from "./routes/newsletter.routes";
import adminRoutes from "./routes/admin.routes";

class App {
  public app: express.Application;

  constructor() {
    this.app = express();
    this.initializeMiddlewares();
    this.initializeSwagger();
    this.initializeRoutes();
    this.initializeErrorHandling();
  }

  private initializeMiddlewares(): void {
    // Security middlewares
    this.app.use(
      helmet({
        contentSecurityPolicy: {
          directives: {
            defaultSrc: ["'self'"],
            styleSrc: [
              "'self'",
              "'unsafe-inline'",
              "https://fonts.googleapis.com",
            ],
            scriptSrc: ["'self'", "'unsafe-inline'"],
            fontSrc: ["'self'", "https://fonts.gstatic.com"],
          },
        },
      })
    );

    this.app.use(
      cors({
        origin: process.env.FRONTEND_URL || "http://localhost:3000",
        credentials: true,
      })
    );

    // Rate limiting
    const limiter = rateLimit({
      windowMs: 15 * 60 * 1000, // 15 minutes
      max: 100, // limit each IP to 100 requests per windowMs
      message: {
        success: false,
        message: "Too many requests from this IP, please try again later.",
        error: "Rate limit exceeded",
      },
      standardHeaders: true,
      legacyHeaders: false,
    });
    this.app.use("/api/", limiter);

    // Logging
    this.app.use(morgan("combined"));

    // Body parsing
    this.app.use(express.json({ limit: "10mb" }));
    this.app.use(express.urlencoded({ extended: true }));

    // Health check endpoint
    this.app.get("/health", (req, res) => {
      res.status(200).json({
        success: true,
        message: "Health & Wellness Blog API is running",
        timestamp: new Date().toISOString(),
        environment: process.env.NODE_ENV || "development",
        version: "1.0.0",
        uptime: process.uptime(),
        memory: process.memoryUsage(),
      });
    });
  }

  private initializeSwagger(): void {
    // Swagger JSON endpoint
    this.app.get("/api-docs.json", (req, res) => {
      res.setHeader("Content-Type", "application/json");
      res.send(swaggerSpec);
    });

    // Swagger UI setup with custom CSS
    const swaggerUiOptions = {
      explorer: true,
      customCss: `
    .swagger-ui .topbar { 
      display: none; 
    }
    .swagger-ui .info .title { 
      color: #1E3A8A; /* deep indigo */
      font-weight: bold;
    }
    .swagger-ui .info .description { 
      font-size: 15px; 
      color: #374151; /* slate gray */
    }
    .swagger-ui .scheme-container { 
      background: #E0F2FE; /* light cyan */
      padding: 12px; 
      border-radius: 8px;
    }
    .swagger-ui .opblock { 
      border-radius: 10px; 
      margin: 8px 0;
      box-shadow: 0 2px 6px rgba(0,0,0,0.05);
    }
    .swagger-ui .opblock.opblock-get { 
      background: #ECFDF5; 
      border-left: 6px solid #10B981; /* green for GET */
    }
    .swagger-ui .opblock.opblock-post { 
      background: #EFF6FF; 
      border-left: 6px solid #3B82F6; /* blue for POST */
    }
    .swagger-ui .opblock.opblock-put { 
      background: #FEF3C7; 
      border-left: 6px solid #F59E0B; /* amber for PUT */
    }
    .swagger-ui .opblock.opblock-delete { 
      background: #FEE2E2; 
      border-left: 6px solid #EF4444; /* red for DELETE */
    }
    .swagger-ui .btn.execute { 
      background-color: #2563EB !important; 
      border-radius: 6px;
      color: white !important;
    }
    .swagger-ui .btn.execute:hover { 
      background-color: #1E40AF !important; 
    }
  `,
      customSiteTitle: "Health & Wellness Blog API",
      customfavIcon: "/favicon.ico",
      swaggerOptions: {
        persistAuthorization: true,
        displayRequestDuration: true,
        docExpansion: "tag",
        filter: true,
        tryItOutEnabled: true,
      },
    };

    // Swagger documentation route
    this.app.use(
      "/api-docs",
      swaggerUi.serve,
      swaggerUi.setup(swaggerSpec, swaggerUiOptions)
    );

    // Redirect root to swagger docs
    this.app.get("/", (req, res) => {
      res.redirect("/api-docs");
    });
  }

  private initializeRoutes(): void {
    // API routes
    this.app.use("/api/auth", authRoutes);
    this.app.use("/api/blogs", blogRoutes);
    this.app.use("/api/bookmarks", bookmarkRoutes);
    this.app.use("/api/categories", categoryRoutes);
    this.app.use("/api/newsletter", newsletterRoutes);
    this.app.use("/api/admin", adminRoutes);

    // API info endpoint
    this.app.get("/api", (req, res) => {
      res.json({
        success: true,
        message: "Health & Wellness Blog API",
        version: "1.0.0",
        documentation: `${req.protocol}://${req.get("host")}/api-docs`,
        endpoints: {
          auth: "/api/auth",
          blogs: "/api/blogs",
          bookmarks: "/api/bookmarks",
          categories: "/api/categories",
          newsletter: "/api/newsletter",
          admin: "/api/admin",
        },
        status: "active",
        timestamp: new Date().toISOString(),
      });
    });

    // 404 handler
    this.app.use("*", (req, res) => {
      res.status(404).json({
        success: false,
        message: "Route not found",
        error: `Cannot ${req.method} ${req.originalUrl}`,
        suggestion: "Visit /api-docs for available endpoints",
      });
    });
  }

  private initializeErrorHandling(): void {
    this.app.use(errorHandler);
  }

  public async initialize(): Promise<void> {
    try {
      await connectDatabase();
      await this.seedData();
      console.log("✅ Application initialized successfully");
    } catch (error) {
      console.error("❌ Failed to initialize application:", error);
      process.exit(1);
    }
  }

  private async seedData(): Promise<void> {
    try {
      // Import models for seeding
      const { User } = await import("./models/user.model");
      const { Category } = await import("./models/category.model");
      const { Blog } = await import("./models/blog.model");
      const { hashPassword } = await import("./utils/password.utils");

      // Check if admin user exists
      const adminExists = await User.findOne({ email: "admin@healthblog.com" });
      if (!adminExists) {
        const hashedPassword = await hashPassword("admin123");
        await User.create({
          name: "Admin User",
          email: "admin@healthblog.com",
          password: hashedPassword,
          role: "admin",
          bookmarks: [],
        });
        console.log("✅ Admin user created: admin@healthblog.com / admin123");
      }

      // Seed categories
      const categoryCount = await Category.countDocuments();
      if (categoryCount === 0) {
        const categories = [
          {
            name: "Nutrition",
            description: "Articles about healthy eating and nutrition tips",
          },
          {
            name: "Mental Health",
            description: "Mental wellness, mindfulness, and stress management",
          },
          {
            name: "Exercise",
            description:
              "Fitness routines, workout guides, and physical activity",
          },
          {
            name: "Sleep",
            description: "Sleep hygiene, rest, and recovery information",
          },
          {
            name: "Lifestyle",
            description: "General lifestyle and wellness advice for daily life",
          },
          {
            name: "Preventive Care",
            description: "Preventive health measures and regular checkups",
          },
        ];

        await Category.insertMany(categories);
        console.log("✅ Sample categories seeded");
      }

      // Seed sample blog posts
      const blogCount = await Blog.countDocuments();
      if (blogCount === 0) {
        const admin = await User.findOne({ role: "admin" });
        if (admin) {
          const sampleBlogs = [
            {
              title: "10 Evidence-Based Tips for Better Sleep Hygiene",
              content: `Good sleep hygiene is crucial for physical and mental health. Here are 10 scientifically-backed strategies to improve your sleep quality:

1. **Maintain a consistent sleep schedule** - Go to bed and wake up at the same time every day, even on weekends.

2. **Create a relaxing bedtime routine** - Develop calming pre-sleep activities like reading, gentle stretching, or meditation.

3. **Optimize your sleep environment** - Keep your bedroom cool (60-67°F), dark, and quiet.

4. **Limit blue light exposure** - Avoid screens 1-2 hours before bedtime or use blue light filters.

5. **Watch your caffeine intake** - Avoid caffeine 6 hours before bedtime as it can interfere with sleep.

6. **Get regular exercise** - Physical activity during the day can improve sleep quality, but avoid vigorous exercise close to bedtime.

7. **Manage stress and anxiety** - Practice relaxation techniques like deep breathing or journaling.

8. **Consider your diet** - Avoid large meals, spicy foods, and alcohol before bedtime.

9. **Get morning sunlight** - Exposure to natural light helps regulate your circadian rhythm.

10. **Don't lie awake in bed** - If you can't fall asleep within 20 minutes, get up and do a quiet activity until you feel sleepy.

Remember, it may take several weeks to see improvements in your sleep quality. Be patient and consistent with these practices.`,
              category: "Sleep",
              tags: ["sleep", "wellness", "health", "hygiene", "rest"],
              authorId: admin._id,
              coverImage:
                "https://images.unsplash.com/photo-1541781774459-bb2af2f05b55?w=800",
            },
            {
              title:
                "The Mediterranean Diet: A Comprehensive Guide to Heart-Healthy Eating",
              content: `The Mediterranean diet has been consistently ranked as one of the healthiest eating patterns in the world. Based on the traditional dietary patterns of countries bordering the Mediterranean Sea, this diet emphasizes whole foods and has been linked to numerous health benefits.

## Key Components of the Mediterranean Diet:

**Fruits and Vegetables**: Aim for 5-9 servings daily. Choose a variety of colors to ensure diverse nutrients.

**Whole Grains**: Replace refined grains with whole grain options like brown rice, quinoa, and whole wheat bread.

**Healthy Fats**: Extra virgin olive oil is the primary source of fat, along with nuts, seeds, and avocados.

**Lean Proteins**: Fish and seafood 2-3 times per week, poultry in moderation, and limited red meat.

**Legumes**: Beans, lentils, and chickpeas provide plant-based protein and fiber.

**Moderate Wine Consumption**: If you drink alcohol, red wine in moderation (1 glass for women, 2 for men daily).

## Health Benefits:

- **Heart Health**: Reduces risk of heart disease by up to 30%
- **Brain Function**: May lower risk of cognitive decline and dementia
- **Weight Management**: Promotes healthy weight through nutrient-dense, satisfying foods
- **Diabetes Prevention**: Helps regulate blood sugar levels
- **Anti-inflammatory**: Rich in antioxidants that fight inflammation

## Getting Started:

1. Start small by replacing butter with olive oil
2. Add more fish to your weekly meal plan
3. Snack on nuts and fruits instead of processed foods
4. Include a salad with every meal
5. Use herbs and spices instead of salt for flavoring

The Mediterranean diet is more than just a way of eating—it's a lifestyle that emphasizes enjoying meals with family and friends, staying physically active, and appreciating the pleasure of wholesome foods.`,
              category: "Nutrition",
              tags: [
                "nutrition",
                "mediterranean",
                "heart health",
                "diet",
                "healthy eating",
              ],
              authorId: admin._id,
              coverImage:
                "https://images.unsplash.com/photo-1490645935967-10de6ba17061?w=800",
            },
            {
              title:
                "Mindfulness Meditation: A Beginner's Guide to Mental Wellness",
              content: `Mindfulness meditation has gained widespread recognition for its powerful effects on mental health and overall well-being. This ancient practice, now backed by modern science, offers a practical approach to managing stress, anxiety, and improving focus.

## What is Mindfulness Meditation?

Mindfulness is the practice of being fully present and engaged in the current moment, without judgment. It involves observing your thoughts, feelings, and sensations as they arise, without getting caught up in them.

## Benefits of Regular Practice:

**Mental Health Benefits:**
- Reduces symptoms of anxiety and depression
- Improves emotional regulation
- Enhances focus and concentration
- Decreases rumination and worry

**Physical Health Benefits:**
- Lowers blood pressure
- Reduces chronic pain
- Improves sleep quality
- Boosts immune system function

## Getting Started: A Simple 5-Minute Practice

1. **Find a comfortable position** - Sit in a chair or on the floor with your back straight but not rigid.

2. **Close your eyes or soften your gaze** - Look down at the floor a few feet in front of you.

3. **Focus on your breath** - Notice the sensation of breathing without trying to change it.

4. **When your mind wanders** - Gently return your attention to your breath. This is normal and part of the practice.

5. **End with gratitude** - Take a moment to appreciate the time you've given yourself.

## Building Your Practice:

**Week 1-2**: Start with 5 minutes daily
**Week 3-4**: Increase to 10 minutes
**Month 2**: Work up to 15-20 minutes

## Common Challenges and Solutions:

**"I can't stop thinking"** - The goal isn't to stop thoughts but to notice them without attachment.

**"I don't have time"** - Even 3-5 minutes can be beneficial. Consider mindful moments throughout your day.

**"I fall asleep"** - Try practicing at a different time of day or in a slightly less comfortable position.

## Integrating Mindfulness into Daily Life:

- Mindful eating: Pay attention to taste, texture, and smell
- Walking meditation: Focus on each step and your surroundings
- Body scan: Notice physical sensations throughout your body
- Loving-kindness: Send positive thoughts to yourself and others

Remember, mindfulness is a skill that develops over time. Be patient with yourself and celebrate small progress along the way.`,
              category: "Mental Health",
              tags: [
                "mindfulness",
                "meditation",
                "stress",
                "mental health",
                "wellness",
              ],
              authorId: admin._id,
              coverImage:
                "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800",
            },
            {
              title:
                "High-Intensity Interval Training (HIIT): Maximize Your Workout in Minimal Time",
              content: `High-Intensity Interval Training (HIIT) has revolutionized the fitness world by proving that shorter, more intense workouts can be more effective than longer, moderate-intensity sessions. This time-efficient approach to fitness is perfect for busy individuals seeking maximum results.

## What is HIIT?

HIIT alternates between short bursts of intense activity followed by recovery periods. A typical session lasts 15-30 minutes, making it ideal for those with limited time.

## Science-Backed Benefits:

**Cardiovascular Health:**
- Improves heart function more effectively than steady-state cardio
- Lowers resting heart rate and blood pressure
- Increases VO2 max (oxygen uptake capacity)

**Weight Management:**
- Burns more calories in less time
- Increases post-exercise oxygen consumption (EPOC)
- Preserves muscle mass while losing fat

**Metabolic Benefits:**
- Improves insulin sensitivity
- Enhances fat oxidation
- Boosts metabolic rate for hours after exercise

## Sample Beginner HIIT Workout (20 minutes):

**Warm-up (5 minutes):**
- Light jogging or marching in place
- Arm circles and leg swings
- Dynamic stretching

**Main Workout (10 minutes):**
Perform each exercise for 45 seconds, rest for 15 seconds:

1. **Jumping Jacks** - Full-body cardio movement
2. **Bodyweight Squats** - Lower body strength
3. **Push-ups** (modified if needed) - Upper body and core
4. **Mountain Climbers** - Core and cardio
5. **Burpees** (simplified version) - Full-body explosive movement

Repeat the circuit twice.

**Cool-down (5 minutes):**
- Walking in place
- Static stretching focusing on major muscle groups
- Deep breathing exercises

## Progressive Training Plan:

**Week 1-2:** 2-3 sessions, focus on form
**Week 3-4:** Increase intensity, maintain good form
**Week 5-6:** Add more challenging exercises or longer work periods
**Week 7+:** Experiment with different HIIT formats

## Safety Guidelines:

- **Start gradually** if you're new to exercise
- **Listen to your body** - some muscle fatigue is normal, pain is not
- **Stay hydrated** before, during, and after workouts
- **Allow recovery time** - HIIT should not be done daily
- **Consult a healthcare provider** before starting any new exercise program

## Different HIIT Formats to Try:

**Tabata:** 20 seconds work, 10 seconds rest, 8 rounds
**30-30:** 30 seconds work, 30 seconds rest
**Pyramid:** Gradually increase then decrease work periods
**EMOM (Every Minute on the Minute):** Complete set reps at the start of each minute

## Making HIIT Work for You:

- **No equipment needed** - Use bodyweight exercises
- **Adaptable intensity** - Modify exercises for your fitness level
- **Time flexible** - Sessions can be 10-30 minutes
- **Variety prevents boredom** - Endless exercise combinations

The key to success with HIIT is consistency and progressive overload. Start where you are, be consistent, and gradually challenge yourself as your fitness improves.`,
              category: "Exercise",
              tags: [
                "HIIT",
                "fitness",
                "workout",
                "cardio",
                "strength training",
              ],
              authorId: admin._id,
              coverImage:
                "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=800",
            },
            {
              title:
                "Building Healthy Habits That Stick: A Science-Based Approach",
              content: `Creating lasting healthy habits is one of the most powerful ways to transform your life. Yet, most people struggle to maintain new behaviors beyond a few weeks. Understanding the science of habit formation can help you build sustainable changes that become automatic parts of your daily routine.

## The Science of Habit Formation

According to research by Dr. Charles Duhigg and others, habits follow a three-part loop:

1. **Cue (Trigger):** The environmental or internal signal that initiates the behavior
2. **Routine (Behavior):** The actual habit or behavior itself
3. **Reward (Benefit):** The positive outcome that reinforces the behavior

## The 4 Laws of Behavior Change

Based on James Clear's research in "Atomic Habits":

**1. Make it Obvious (Cue)**
- Use implementation intentions: "I will [behavior] at [time] in [location]"
- Stack habits: Attach new habits to existing ones
- Design your environment to make cues visible

**2. Make it Attractive (Craving)**
- Bundle tempting activities with necessary ones
- Join communities where desired behavior is normal
- Focus on the benefits and positive feelings

**3. Make it Easy (Response)**
- Start with the smallest possible version (2-minute rule)
- Reduce friction for good habits
- Prime your environment for success

**4. Make it Satisfying (Reward)**
- Celebrate small wins immediately
- Track your progress visually
- Never miss twice in a row

## Practical Strategies for Common Health Habits:

### Starting a Morning Exercise Routine:
- **Cue:** Place workout clothes next to your bed
- **Make it easy:** Start with just 10 push-ups
- **Reward:** Enjoy your favorite healthy breakfast afterward
- **Track:** Mark an X on a calendar after each workout

### Drinking More Water:
- **Cue:** Keep a water bottle on your desk
- **Stack:** Drink water every time you check your phone
- **Make it attractive:** Use a bottle you love or add fruit for flavor
- **Track:** Use rubber bands or apps to monitor intake

### Eating More Vegetables:
- **Environment:** Pre-cut vegetables and keep them visible in the fridge
- **Make it easy:** Start by adding one vegetable to meals you already eat
- **Make it attractive:** Try new recipes and cooking methods
- **Reward:** Notice how much better you feel with more nutrients

## The Power of Small Changes

Research shows that tiny improvements compound over time:
- 1% better each day = 37x better over a year
- 1% worse each day = nearly zero progress

Focus on:
- **Consistency over perfection**
- **Systems over goals**
- **Process over outcomes**
- **Identity over results**

## Common Mistakes to Avoid:

1. **Starting too big** - Begin with habits so small they seem trivial
2. **Relying on motivation alone** - Build systems that work even when motivation is low
3. **Focusing only on outcomes** - Celebrate the process, not just results
4. **All-or-nothing thinking** - Progress, not perfection, is the goal
5. **Ignoring your environment** - Your surroundings shape your behavior

## Creating a Habit Implementation Plan:

1. **Choose ONE habit** to focus on at a time
2. **Identify your WHY** - Connect it to your values and identity
3. **Make it specific** - When, where, and how will you do it?
4. **Start ridiculously small** - What's the easiest version?
5. **Plan for obstacles** - What might go wrong, and how will you handle it?
6. **Track your progress** - Use a simple method that works for you
7. **Review and adjust** - Weekly check-ins to refine your approach

## The Identity-Based Approach

Instead of focusing on what you want to achieve, focus on who you want to become:
- "I am someone who prioritizes their health"
- "I am someone who exercises regularly"  
- "I am someone who makes nutritious food choices"

Each time you perform the habit, you cast a vote for this identity. The more votes you cast, the stronger the identity becomes, and the more automatic the behavior.

Remember: Habit formation is a marathon, not a sprint. Be patient with yourself, celebrate small wins, and trust in the power of compound growth. Every expert was once a beginner who refused to give up.`,
              category: "Lifestyle",
              tags: [
                "habits",
                "behavior change",
                "lifestyle",
                "self-improvement",
                "wellness",
              ],
              authorId: admin._id,
              coverImage:
                "https://images.unsplash.com/photo-1434030216411-0b793f4b4173?w=800",
            },
          ];

          await Blog.insertMany(sampleBlogs);
          console.log("✅ Sample blog posts seeded");
        }
      }

      console.log("✅ Database seeding completed");
    } catch (error) {
      console.error("❌ Error seeding data:", error);
    }
  }
}

export default App;
