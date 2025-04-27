import mongoose from "mongoose"
import dotenv from "dotenv"
import User from "./models/User.js"
import Article from "./models/Article.js"
import Comment from "./models/Comment.js"

dotenv.config()

const categories = ["politics", "sports", "technology", "business", "entertainment", "health", "science"]

// Sample data
const users = [
  {
    username: "admin",
    email: "admin@newsstream.com",
    password: "admin123",
    role: "admin",
  },
  {
    username: "john_doe",
    email: "john@example.com",
    password: "password123",
    role: "user",
  },
  {
    username: "jane_smith",
    email: "jane@example.com",
    password: "password123",
    role: "user",
  },
]

const articles = [
  {
    title: "Global Tech Summit Announces Revolutionary AI Advancements",
    description:
      "Leading tech companies unveil groundbreaking artificial intelligence technologies at this year's Global Tech Summit.",
    content: `The annual Global Tech Summit, held this week in Silicon Valley, has become the stage for several major technological breakthroughs in artificial intelligence.

Companies including Google, Microsoft, and OpenAI presented their latest advancements, showcasing technologies that promise to transform industries from healthcare to transportation.

"What we're witnessing is not just incremental progress, but fundamental leaps in how machines learn and interact with humans," said Dr. Lisa Chen, Chief AI Scientist at Google. "The models we're developing today can understand context, nuance, and even emotional subtleties in ways that were science fiction just five years ago."

Among the most impressive demonstrations was a new language model that can write code, debug existing software, and even design simple applications based on verbal descriptions alone. This tool is expected to dramatically accelerate software development and make programming accessible to non-technical users.

In the healthcare sector, Microsoft unveiled an AI system capable of analyzing medical images with greater accuracy than trained radiologists, potentially revolutionizing early disease detection. The system has already shown remarkable results in identifying early-stage cancers that human doctors missed.

"The potential for saving lives is enormous," explained Dr. James Rodriguez, Head of Healthcare AI at Microsoft. "We're not looking to replace medical professionals, but to give them super-powered tools that enhance their capabilities."

Privacy concerns were addressed head-on by many presenters, with new frameworks for "explainable AI" that make the decision-making processes of these systems more transparent and understandable to users and regulators alike.

The summit also featured panel discussions on ethical AI development, with representatives from government agencies and advocacy groups calling for thoughtful regulation that encourages innovation while protecting consumer rights.

As the conference wraps up, it's clear that AI is no longer just a promising technology of the future—it's rapidly becoming integrated into the fabric of our daily lives and transforming how we work, communicate, and solve problems.`,
    category: "technology",
    imageUrl: "https://images.unsplash.com/photo-1573164713988-8665fc963095",
    author: "Sarah Johnson",
    tags: ["technology", "ai", "innovation", "conference"],
    isFeatured: true,
    views: 1245,
  },
  {
    title: "National Basketball Championship Ends with Dramatic Overtime Victory",
    description: "The Eagles clinched the national title with a stunning last-minute three-pointer in overtime.",
    content: `In what sports analysts are already calling one of the greatest championship games ever played, the Eagles defeated the Wolves 86-83 in overtime to win the National Basketball Championship.

The game came down to the final seconds of overtime when Eagles star player Marcus Williams hit a three-pointer from well beyond the arc with just 0.8 seconds remaining on the clock. The Wolves had no time to respond, and the Eagles' bench erupted in celebration as the buzzer sounded.

"I've practiced that shot thousands of times," Williams said in the post-game press conference, still visibly emotional. "When the ball left my hands, I just knew it was going in. This is what we've worked for all season."

The championship caps an incredible season for the Eagles, who faced significant adversity after losing their starting center to injury midway through the season. Head coach Daniel Peterson made strategic adjustments to the team's playing style, embracing a faster, more perimeter-oriented approach that ultimately paid off.

"This team never stopped believing," Peterson said. "Even when we were down by seven points with two minutes left in regulation, there was no panic in their eyes. Just determination."

The Wolves, who entered the tournament as the top-ranked team in the nation, played phenomenally throughout but fell just short in the final moments. Their coach, Lisa Martinez, praised her team's effort while acknowledging the brilliance of Williams' game-winning shot.

"Sometimes you just have to tip your hat to greatness," Martinez said. "Our players executed our defensive strategy perfectly on that final possession. Williams just made an incredible shot that very few players in the world could make."

The game drew record television ratings and generated massive social media engagement, with clips of Williams' shot being shared millions of times within hours of the game's conclusion.

For the Eagles, this victory marks their first national championship in 15 years and cements Williams' legacy as one of the program's all-time greats.`,
    category: "sports",
    imageUrl: "https://images.unsplash.com/photo-1546519638-68e109498ffc",
    author: "Michael Rodriguez",
    tags: ["sports", "basketball", "championship"],
    views: 876,
  },
  {
    title: "New Economic Policy Aims to Boost Small Businesses",
    description:
      "Government unveils comprehensive economic package focused on supporting entrepreneurs and small business owners.",
    content: `The federal government announced today a sweeping economic policy package designed to provide critical support to small businesses and entrepreneurs across the country.

The Small Business Revitalization Act, unveiled in a press conference by Treasury Secretary Eleanor Diaz, includes tax incentives, grants, and low-interest loans aimed at helping small businesses recover from recent economic challenges and expand their operations.

"Small businesses are the backbone of our economy, employing nearly half of all private sector workers," Diaz said. "This legislation provides them with the tools and resources they need to thrive in today's competitive marketplace."

Key provisions of the act include:
- A 25% tax credit for small businesses that hire new employees or increase wages
- $50 billion in grants for businesses in underserved communities
- Streamlined regulatory processes to reduce paperwork burdens
- Expanded access to government contracts for small businesses
- Low-interest loans for technology upgrades and green energy investments

Business groups have generally responded positively to the announcement, though some express concerns about implementation details.

"The direction is promising, but as always, the devil is in the details," said Marcus Johnson, president of the National Small Business Association. "We're particularly interested in how quickly these programs will be accessible to business owners who need help right now."

Opposition lawmakers have questioned the package's $200 billion price tag, arguing that it adds too much to the national debt. However, economic analysts suggest the investment could pay for itself through increased economic activity and tax revenues if successfully implemented.

Small business owners like Elena Rodriguez, who runs a family restaurant in Chicago, are cautiously optimistic about the plan.

"After everything we've been through, it's good to see concrete support instead of just talk," Rodriguez said. "If this helps me hire back some of the staff we had to let go and maybe finally upgrade our kitchen equipment, it could be a game-changer for us."

The legislation now moves to Congress, where debate is expected to begin next week. Administration officials have expressed hope that the bill could be passed and signed into law within the next two months.`,
    category: "business",
    imageUrl: "https://images.unsplash.com/photo-1521791136064-7986c2920216",
    author: "David Chen",
    tags: ["economy", "small business", "policy"],
    views: 542,
  },
  {
    title: "Scientists Discover Potential Breakthrough in Alzheimer's Treatment",
    description:
      "A new research study shows promising results for reversing memory loss associated with Alzheimer's disease.",
    content: `In what could represent a significant breakthrough in neuroscience, researchers at the National Institute of Neurological Studies have identified a compound that appears to reverse memory loss associated with Alzheimer's disease in laboratory animals.

The study, published today in the Journal of Neuroscience, details how the compound—named NXT-738—targets the tau protein tangles that are characteristic of Alzheimer's disease. Unlike previous treatments that mainly focused on amyloid plaques, this approach addresses what many scientists now believe may be the more critical factor in cognitive decline.

"We've seen remarkable results in our mouse models," said Dr. Jennifer Lee, the study's lead author. "Animals with advanced Alzheimer's-like symptoms showed significant improvement in memory tests after just three weeks of treatment, with some performing at near-normal levels."

The research team observed not only behavioral improvements but also physical changes in the brain tissue of treated animals, with noticeable reduction in tau tangles and signs of neuron regeneration.

"What's particularly exciting is that we're not just halting the progression of the disease, but actually seeing evidence of reversal," explained Dr. Robert Kim, a neurologist not involved in the study but familiar with the research. "This suggests we might be able to restore function even after symptoms have appeared."

The compound works by activating a specific enzyme pathway that helps neurons clear out misfolded tau proteins while simultaneously strengthening cellular support structures. This dual action appears to be key to its effectiveness.

While these results are promising, the researchers caution that many treatments that show success in animal models fail to translate to humans. Clinical trials in humans are still at least two years away, pending further safety studies and regulatory approval.

"We need to be cautiously optimistic," Dr. Lee emphasized. "But if these results hold up in human trials, it could represent the most significant advancement in Alzheimer's treatment in decades."

The Alzheimer's Association has described the findings as "potentially groundbreaking" while emphasizing the need for continued research. With over 6 million Americans living with Alzheimer's disease and that number expected to more than double by 2050, effective treatments are desperately needed.

The research was funded by a combination of government grants and private funding from the Alzheimer's Research Foundation.`,
    category: "health",
    imageUrl: "https://images.unsplash.com/photo-1576671081837-49000212a370",
    author: "Dr. Elizabeth Warren",
    tags: ["health", "alzheimers", "research", "medicine"],
    views: 980,
  },
  {
    title: "Major Film Studio Announces New Superhero Franchise",
    description:
      "Universal Entertainment unveils plans for an original superhero universe with five films planned over the next six years.",
    content: `Universal Entertainment shocked the film industry today by announcing an ambitious new superhero franchise that will span at least five films over the next six years.

The studio revealed "Paragon," an original superhero universe not based on existing comic book properties, during their annual shareholder meeting. The announcement included concept art, a teaser trailer, and appearances by several A-list actors already signed to star in the franchise.

"We've been developing Paragon in secret for over four years," said Universal CEO Rebecca Martinez. "We wanted to create something truly original that speaks to our current moment while delivering the spectacular entertainment audiences love."

According to details shared at the event, Paragon will focus on ordinary people who develop extraordinary abilities following a mysterious global event. Unlike traditional superhero narratives, these characters will not don costumes or adopt secret identities, instead navigating a world that reacts to their powers with both wonder and fear.

Academy Award-winning director James Chen has been tapped to helm the first film, scheduled for release next summer. Chen is known for his visually stunning style and character-driven storytelling.

"What drew me to this project was the opportunity to explore what would really happen if people suddenly had these abilities," Chen explained. "How would governments respond? How would it affect relationships? These are fascinating questions that go beyond typical superhero fare."

The studio has reportedly invested over $300 million in development and pre-production, making Paragon one of the most expensive original film franchises ever attempted. Industry analysts are divided on whether the gamble will pay off in an entertainment landscape dominated by established intellectual properties.

"It's a huge risk, but the timing might be perfect," said film industry expert Maria Johnson. "There's some evidence of superhero fatigue with traditional franchises, and audiences are hungry for fresh stories."

Universal has also announced an extensive transmedia strategy, including a companion television series, podcast, and augmented reality experiences that will expand the Paragon universe beyond the films themselves.

Casting announcements included Emma Stone, John Boyega, and Lupita Nyong'o in leading roles, with more stars expected to join the ensemble cast in the coming months.

The first film, titled "Paragon: Awakening," begins principal photography next month.`,
    category: "entertainment",
    imageUrl: "https://images.unsplash.com/photo-1478720568477-152d9b164e26",
    author: "Jessica Williams",
    tags: ["movies", "entertainment", "superhero"],
    views: 1532,
  },
  {
    title: "Climate Summit Concludes with New International Agreements",
    description: "World leaders reach consensus on ambitious climate goals after week-long negotiations.",
    content: `The International Climate Summit concluded today with 195 nations signing a landmark agreement that establishes more ambitious targets for reducing greenhouse gas emissions and provides substantial funding for climate adaptation in developing nations.

The agreement, dubbed the "Global Climate Compact," commits signatories to reducing carbon emissions by 60% from 2005 levels by 2035—a significantly more aggressive timeline than previous international accords. It also establishes a $100 billion annual fund to help vulnerable nations adapt to already unavoidable climate impacts.

"This is the moment when the world chose action over apathy, cooperation over conflict," said United Nations Secretary-General Amina Mohammed in her closing address. "While these commitments alone won't solve the climate crisis, they represent a crucial acceleration of our collective response."

The summit, hosted in Nairobi, Kenya, marked the first time a major climate conference was held in sub-Saharan Africa—a region highly vulnerable to climate impacts despite contributing minimally to global emissions.

Negotiations extended nearly 48 hours beyond the scheduled conclusion as delegates worked to resolve contentious issues around financing and the pace of fossil fuel phaseouts. A breakthrough came when a coalition of wealthy nations agreed to significantly increase their financial contributions while major emerging economies accepted more stringent emissions reduction schedules.

"We recognize that the burden of leadership falls on those nations who have contributed most to the problem," said U.S. climate envoy Catherine Mitchell. "But we also celebrate that this agreement represents true compromise from all parties."

A key provision establishes a first-ever global framework for addressing "loss and damage"—the destructive impacts of climate change that cannot be adapted to, such as island nations facing existential threats from rising seas.

Environmental groups offered mixed reactions, with many praising the strengthened targets while expressing concern about enforcement mechanisms.

"The goals set here are more aligned with scientific necessity than any previous agreement," said Greenpeace International Director Carlos Rodriguez. "But without legally binding enforcement, we risk a repeat of past failures where ambitious targets were set but never met."

Implementation of the compact begins immediately, with nations required to submit detailed action plans within 12 months and undergo biennial progress reviews.

The next major climate summit is scheduled for 2025 in Brazil, where nations will assess early progress and potentially strengthen commitments further.`,
    category: "politics",
    imageUrl: "https://images.unsplash.com/photo-1540910419892-4a36d2c3266c",
    author: "Robert Johnson",
    tags: ["politics", "climate", "international"],
    views: 621,
  },
]

// Connect to MongoDB
mongoose
  .connect(process.env.MONGODB_URI || "mongodb://localhost:27017/news-stream")
  .then(async () => {
    console.log("MongoDB connected for seeding...")

    try {
      // Clear existing data
      await User.deleteMany({})
      await Article.deleteMany({})
      await Comment.deleteMany({})

      console.log("Previous data cleared")

      // Insert users
      const createdUsers = await User.insertMany(users)
      console.log(`${createdUsers.length} users created`)

      // Insert articles
      const createdArticles = await Article.insertMany(articles)
      console.log(`${createdArticles.length} articles created`)

      // Create some comments
      const comments = [
        {
          articleId: createdArticles[0]._id,
          author: createdUsers[1]._id,
          authorName: createdUsers[1].username,
          content: "This is really fascinating! I wonder how AI will transform our daily lives in the next decade.",
        },
        {
          articleId: createdArticles[0]._id,
          author: createdUsers[2]._id,
          authorName: createdUsers[2].username,
          content: "I have some concerns about AI safety. I hope these companies are taking the necessary precautions.",
        },
        {
          articleId: createdArticles[1]._id,
          author: createdUsers[1]._id,
          authorName: createdUsers[1].username,
          content: "What an amazing game! Williams is definitely MVP material this season.",
        },
      ]

      const createdComments = await Comment.insertMany(comments)
      console.log(`${createdComments.length} comments created`)

      console.log("Database seeded successfully!")
      process.exit(0)
    } catch (error) {
      console.error("Error seeding database:", error)
      process.exit(1)
    }
  })
  .catch((err) => {
    console.error("MongoDB connection error:", err)
    process.exit(1)
  })
