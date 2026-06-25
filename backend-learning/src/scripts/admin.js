const user =require("../models/user");
const bcrypt = require("bcrypt");

async function createAdmin() {
    try{
        const adminEmail = "admin@tester.com";
        const existingAdmin = await user.findOne({ email: adminEmail });

        if (!existingAdmin) {
            const newAdmin = new user({
                email: adminEmail,
                password: await bcrypt.hash("admin123",10),
                name: "AdminUser",
                role:"admin",
            });
            await newAdmin.save();
            console.log("Admin user created successfully.");
        }else{
            // await existingAdmin.deleteOne();
            console.log("Admin user already exists.");
        }
    }catch(error){
        console.error("Error creating admin user:", error);
    }
}
module.exports = createAdmin;
