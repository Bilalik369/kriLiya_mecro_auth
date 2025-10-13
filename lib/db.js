import mongoose from "mongoose";



export const connectdb = async()=>{
    try {
        await mongoose.connect(process.env.MONGO)
        console.log("Base de données connectée")
    } catch (error) {
        console.log("Erreur de connexion à la base de données")
        process.exit(1)
    }
}

