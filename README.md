# Project Progress Tracker 📊

## Getting Started

### Configuring it ✏️

```
cd backend
```

Edit the `.env` file to configure the project.
The following variables are required:

- `name`: Project name
- `bestDays`: Best case days, i.e. 1 point = 1 day
- `worstDays`: Worst case days, i.e. 1 point = 2-3 days
- `engineers`: Number of engineers
- `speedup`: Speedup factor. 1.3-1.5 are common values, remember adding more engineers does not speed up the project linearly.

#### Adding milestones

Add milestones by adding the following variables:

- `milestone1Name`: Milestone name
- `milestone1TotalPoints`: Total points for the milestone
- `milestone1CompletedPoints`: Completed points for the milestone

You can add more milestones by adding more variables but they must follow the same pattern. I.e. `milestone2Name`, `milestone2TotalPoints`, `milestone2CompletedPoints`.

### Running it 🏃🏽‍♀️
1. Install dependencies:
   ```sh
   npm install
   ```
2. Start the frontend & backend:
   ```sh
   npm start
   ```
   The app will open at http://localhost:3000
