import { AppDataSource } from "./data-source"
import { NewPixel } from "./entity/NewPixel"

AppDataSource.initialize().then(async () => {

    // console.log("Inserting a new user into the database...")
    // const user = new NewPixel()
    // user.positionX = 1
    // user.positionY = 2
    // user.color = 3
    // await AppDataSource.manager.save(user)
    // console.log("Saved a new user with id: " + user.id)

    console.log("Loading users from the database...")
    const users = await AppDataSource.manager.find(NewPixel)
    console.log("Loaded users: ", users)

    console.log("Here you can setup and run express / fastify / any other framework.")

}).catch(error => console.log(error))
