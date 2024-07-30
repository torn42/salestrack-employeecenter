package main

import (
    "context"
    "log"
    "net/http"
    "time"

    "github.com/gin-gonic/gin"
    "go.mongodb.org/mongo-driver/bson"
    "go.mongodb.org/mongo-driver/mongo"
    "go.mongodb.org/mongo-driver/mongo/options"
)

// User represents a user structure in the database
type User struct {
    FullName    string `json:"fullName"`
    PhoneNumber string `json:"phoneNumber"`
    Email       string `json:"email"`
    Password    string `json:"password"`
}

// connectDB establishes a connection to the MongoDB database
func connectDB() *mongo.Client {
    client, err := mongo.NewClient(options.Client().ApplyURI("mongodb+srv://torn42:123@cluster0.6g1f0ui.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"))
    if err != nil {
        log.Fatal(err)
    }
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    err = client.Connect(ctx)
    if err != nil {
        log.Fatal(err)
    }
    return client
}

var client *mongo.Client = connectDB()

func login(c *gin.Context) {
    var user User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    collection := client.Database("SalesTrack").Collection("Admins")
    filter := bson.M{"email": user.Email}
    var result User
    err := collection.FindOne(context.Background(), filter).Decode(&result)
    if err != nil {
        c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
        return
    }

    if user.Password != result.Password {
        c.JSON(http.StatusUnauthorized, gin.H{"status": "unauthorized"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"status": "logged in", "user": result})
}



func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}

func main() {
    r := gin.Default()
    r.Use(CORSMiddleware())
    r.POST("/signin", login)
    r.Run(":8080")
}