import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { v4 as uuidv4 } from "uuid";

const JWT_SECRET = process.env.JWT_SECRET || "lumina_secret_key_2026";

async function startServer() {
  const app = express();
  const PORT = 3000;

  app.use(express.json());

  // --- Database (In-Memory) ---
  const db = {
    users: [] as any[],
    orders: [] as any[],
    reviews: [] as any[],
    products: [
      {
        id: "1",
        name: "Monolith Wireless Headphones",
        description: "Experience silence with active noise cancellation and premium titanium drivers.",
        price: 299.0,
        image: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800&q=80",
        category: "Audio",
        inStock: true
      },
      {
        id: "2",
        name: "Aura Mechanical Keyboard",
        description: "Low-profile mechanical switches housed in a sleek minimalist aluminum chassis.",
        price: 159.0,
        image: "https://images.unsplash.com/photo-1595225476474-87563907a212?w=800&q=80",
        category: "Peripherals",
        inStock: true
      },
      {
        id: "3",
        name: "Zenith Smartwatch",
        description: "A dark, elegant timepiece featuring advanced bio-tracking and a 14-day battery.",
        price: 199.0,
        image: "https://images.unsplash.com/photo-1546868871-7041f2a55e12?w=800&q=80",
        category: "Wearables",
        inStock: false
      },
      {
        id: "4",
        name: "Eclipse Floor Lamp",
        description: "Ambient LED lighting that blends seamlessly into any modern room.",
        price: 129.0,
        image: "https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800&q=80",
        category: "Home",
        inStock: true
      },
      {
        id: "5",
        name: "Lumina Work Desk",
        description: "Ergonomic standing desk with a matte black finish and hidden cable management.",
        price: 599.0,
        image: "https://images.unsplash.com/photo-1518455027359-f3f8164ba6bd?w=800&q=80",
        category: "Furniture",
        inStock: true
      },
      {
        id: "6",
        name: "Onyx Backpack",
        description: "Weather-resistant, minimalist backpack for the urban professional.",
        price: 89.0,
        image: "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=800&q=80",
        category: "Travel",
        inStock: true
      },
      {
        id: "7",
        name: "Vanguard Coffee Maker",
        description: "A precision espresso machine engineered for the perfect daily brew.",
        price: 349.0,
        image: "https://images.unsplash.com/photo-1608354580875-30bd4168b351?q=80&w=387&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Home",
        inStock: true
      },
      {
        id: "8",
        name: "Aero Desk Mat",
        description: "Premium synthetic leather desk mat for a smooth and protective workspace surface.",
        price: 49.0,
        image: "https://images.unsplash.com/photo-1702561667800-2c49b0182229?q=80&w=725&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D",
        category: "Peripherals",
        inStock: true
      },
      {
        id: "9",
        name: "Void Bluetooth Speaker",
        description: "Portable sound system crafted from recycled aluminum with 360-degree acoustic tuning.",
        price: 189.0,
        image: "https://images.unsplash.com/photo-1608043152269-423dbba4e7e1?w=800&q=80",
        category: "Audio",
        inStock: true
      },
      {
        id: "10",
        name: "Nimbus Travel Mug",
        description: "Double-walled ceramic lined travel vessel. Retains temperature for 18 hours.",
        price: 35.0,
        image: "https://images.unsplash.com/photo-1514228742587-6b1558fcca3d?w=800&q=80",
        category: "Home",
        inStock: true
      }
    ]
  };

  // --- Auth Middleware ---
  const authenticateToken = (req: any, res: any, next: any) => {
    const authHeader = req.headers["authorization"];
    const token = authHeader && authHeader.split(" ")[1];
    if (!token) return res.status(401).json({ error: "Access denied" });

    jwt.verify(token, JWT_SECRET, (err: any, user: any) => {
      if (err) return res.status(403).json({ error: "Invalid token" });
      req.user = user;
      next();
    });
  };

  // --- API Routes ---

  // Auth Routes
  app.post("/api/auth/register", async (req, res) => {
    const { name, email, password } = req.body;
    if (!name || !email || !password) {
      return res.status(400).json({ error: "All fields are required" });
    }
    
    const existingUser = db.users.find((u) => u.email === email);
    if (existingUser) {
      return res.status(400).json({ error: "Email already in use" });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = { id: uuidv4(), name, email, password: hashedPassword };
    db.users.push(newUser);

    const token = jwt.sign({ id: newUser.id, email: newUser.email, name: newUser.name }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: newUser.id, name: newUser.name, email: newUser.email } });
  });

  app.post("/api/auth/login", async (req, res) => {
    const { email, password } = req.body;
    const user = db.users.find((u) => u.email === email);
    
    if (!user || !(await bcrypt.compare(password, user.password))) {
      return res.status(401).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id, email: user.email, name: user.name }, JWT_SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user.id, name: user.name, email: user.email } });
  });

  app.get("/api/auth/me", authenticateToken, (req: any, res) => {
    const user = db.users.find((u) => u.id === req.user.id);
    if (!user) return res.status(404).json({ error: "User not found" });
    res.json({ user: { id: user.id, name: user.name, email: user.email } });
  });

  // Product Routes
  app.get("/api/products", (req, res) => {
    // Attach reviews to products
    const productsWithReviews = db.products.map(p => ({
      ...p,
      reviews: db.reviews.filter(r => r.productId === p.id)
    }));
    res.json(productsWithReviews);
  });

  app.get("/api/products/:id", (req, res) => {
    const product = db.products.find(p => p.id === req.params.id);
    if (product) {
      const reviews = db.reviews.filter(r => r.productId === product.id);
      res.json({ ...product, reviews });
    } else {
      res.status(404).json({ error: "Product not found" });
    }
  });

  // Review Routes
  app.post("/api/products/:id/reviews", authenticateToken, (req: any, res) => {
    const { rating, comment } = req.body;
    const productId = req.params.id;
    
    if (!rating || !comment) {
      return res.status(400).json({ error: "Rating and comment are required" });
    }

    const newReview = {
      id: uuidv4(),
      productId,
      userId: req.user.id,
      userName: req.user.name,
      rating: Number(rating),
      comment,
      createdAt: new Date().toISOString()
    };

    db.reviews.push(newReview);
    res.json(newReview);
  });

  // Order Routes
  app.post("/api/orders", authenticateToken, (req: any, res) => {
    const { items, total, customerDetails } = req.body;
    
    if (!items || items.length === 0) {
      return res.status(400).json({ error: "No items in the order" });
    }

    const newOrder = {
      id: "ORD-" + uuidv4().substring(0, 8).toUpperCase(),
      userId: req.user.id,
      items,
      total,
      customerDetails,
      status: "Processing",
      createdAt: new Date().toISOString()
    };
    
    db.orders.push(newOrder);

    setTimeout(() => {
      res.json({
        success: true,
        orderId: newOrder.id,
        message: "Order processed successfully",
        estimatedDelivery: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString()
      });
    }, 1500); // Simulated delay
  });

  app.get("/api/orders", authenticateToken, (req: any, res) => {
    const userOrders = db.orders.filter(o => o.userId === req.user.id);
    res.json(userOrders.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()));
  });

  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log("Server running on http://localhost:" + PORT);
  });
}

startServer();
