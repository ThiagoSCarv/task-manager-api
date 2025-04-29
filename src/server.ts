import { app } from "./app";

const PORT = process.env.PORT

app.listen(PORT, () => console.log(`SERVER IS RUNNING ON PORT ${PORT}`))