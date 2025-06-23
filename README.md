# Doodle It Out
![image](https://github.com/user-attachments/assets/01035071-ab57-4532-9d9e-909805209e2a)

**Author:** HOO DY LLEN (81785)

## Introduction

Doodle It Out is an interactive web application designed to help young learners practice and reinforce vocabulary through doodling. Users draw objects, animals, or food items on a digital canvas, and the system uses machine learning (DoodleNet via ml5.js) to recognize their drawings. The app features pre- and post-tests, vocabulary-based doodle games, and an admin dashboard for teachers to track student progress and scores.

Key features:
- Doodle recognition using p5.js and ml5.js
- Pre-test and post-test for learning assessment
- Student login and progress tracking
- Admin dashboard with student management and analytics

## Live Demo

Try the app here: [https://fyp-doodlenet-with-supabase.vercel.app/](https://fyp-doodlenet-with-supabase.vercel.app/)

## How to Run Locally

1. **Clone the repository:**
   ```sh
   git clone https://github.com/dydxllen/fyp-doodlenet-with-supabase.git
   cd fyp-doodlenet-with-supabase
   ```

2. **Install dependencies:**
   ```sh
   npm install
   ```

3. **Set up environment variables:**
   - Copy `.env.local.example` to `.env.local` (if available) or create `.env.local`.
   - Add your Supabase credentials:
     ```
     NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
     NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
     ```

4. **Run the development server:**
   ```sh
   npm run dev
   ```

5. **Open the app:**
   - Visit [http://localhost:3000](http://localhost:3000) in your browser.

---

## Setting Up Supabase

1. **Create a Supabase Project:**
   - Go to [https://app.supabase.com/](https://app.supabase.com/) and sign in.
   - Click "New Project" and follow the instructions to create your project.
   - Once created, go to Project Settings > API to find your `SUPABASE_URL` and `SUPABASE_ANON_KEY`.

2. **Create the Database Schema:**
   - In the Supabase dashboard, go to the SQL Editor.
   - Copy and paste the contents of `database/database-scheme.sql` into a new query.
   - Run the query to create the necessary tables:
     - `admin`
     - `students`
     - `student_answers`
     - `test_attempts`

   > **Note:** The provided SQL schema is for reference. You may need to adjust table/constraint order if you encounter errors due to foreign key dependencies.

3. **Configure Authentication (Optional):**
   - Set up authentication providers in Supabase if you want to use email/password or other login methods for students/admins.

---

For more details, see the code in [app/](app/) and [components/](components/)
