import app from "./app";
import { PORT } from "./config/env.config";

app.listen(PORT, () => {
  console.log(`Server is running on port:${PORT}`);
});
