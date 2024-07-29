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
    "github.com/twilio/twilio-go"
    openapi "github.com/twilio/twilio-go/rest/api/v2010"
)

// User структура для MongoDB
type User struct {
    FullName    string `json:"fullName"`
    PhoneNumber string `json:"phoneNumber"`
    Email       string `json:"email"`
    Password    string `json:"password"`
}

var client *mongo.Client

func CORSMiddleware() gin.HandlerFunc {
    return func(c *gin.Context) {
        c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
        c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
        c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
        c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

        if c.Request.Method == "OPTIONS" {
            c.AbortWithStatus(204)
            return
        }

        c.Next()
    }
}

func login(c *gin.Context) {
    var user User
    if err := c.ShouldBindJSON(&user); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    collection := client.Database("testdb").Collection("users")
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

func sendWhatsAppMessage(to string, message string) error {
    accountSid := "your_account_sid"
    authToken := "your_auth_token"
    twilioClient := twilio.NewRestClientWithParams(twilio.ClientParams{
        Username: accountSid,
        Password: authToken,
    })

    params := &openapi.CreateMessageParams{}
    params.SetTo("whatsapp:" + to)
    params.SetFrom("whatsapp:your_twilio_phone_number")
    params.SetBody(message)

    _, err := openapi.NewApiService(twilioClient).CreateMessage(params)
    if err != nil {
        log.Printf("Failed to send message: %s", err.Error())
        return err
    }

    log.Println("Message sent successfully")
    return nil
}

func sendWhatsApp(c *gin.Context) {
    var request struct {
        PhoneNumber string `json:"phoneNumber"`
        Message     string `json:"message"`
    }

    if err := c.ShouldBindJSON(&request); err != nil {
        c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
        return
    }

    err := sendWhatsAppMessage(request.PhoneNumber, request.Message)
    if err != nil {
        c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to send message"})
        return
    }

    c.JSON(http.StatusOK, gin.H{"status": "Message sent"})
}

func main() {
    ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
    defer cancel()
    var err error
    client, err = mongo.Connect(ctx, options.Client().ApplyURI("mongodb://localhost:27017"))
    if err != nil {
        log.Fatal(err)
    }

    r := gin.Default()
    r.Use(CORSMiddleware())
    r.POST("/signin", login)
    r.POST("/send-whatsapp", sendWhatsApp)
    r.Run(":8080")
}