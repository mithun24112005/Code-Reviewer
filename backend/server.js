import app from "./src/app.js";
import dotenv from "dotenv"

dotenv.config()
const PORT=process.env.PORT || 3000

app.listen(PORT,()=>{
    console.log(`server running in port:${PORT}`);
})

