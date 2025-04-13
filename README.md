# IDD Project Site

## Overview

For right now, you should only be worried about the following files/directories. Almost everything else is boilerplate:

```
root/
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── styles/
│   │   ├── App.css
│   │   ├── App.jsx
│   │   ├── index.css
│   │   └── main.jsx
│   └── index.html
├── server/
│   ├── data/
│   ├── database.js
│   ├── index.js
│   ├── migrate.js
│   └── providers.js

```

-   All the frontend code resides in the `client` folder.
    -   The `components` directory contains the building blocks used for the site.
    -   The `pages` directory contains the layout of the different pages (Home, About, Services, etc.). It basically uses the building blocks from `components` to lay the different pages out.
    -   The `styles` directory contains CSS styles for almost everything. Each component/page might have its own styles file which defines the styles used in that file.
-   The `server` directory mostly contains backend code including the backend API routes, PostgreSQL database setup, and logic for other necessary functionalities for the site as it relates to handling data, such as processing the provider data, getting their location on the map (latitude and longitude) through a process called geocoding, and parsing this data as JSON. It kind of semi-automated for now.

## Testing

For testing purposes for now, follow the following steps

> [!NOTE]
> You'll need to create a `.env` file in both your `client` and `server` directories. I didn't put these in the online repo since it contains username and password for the admin login as well as the link to the database connection which you will most definitely need.
>
> Reach out to me for the details when needed or if you need any help to creating the env file.

1. Open VSCode and open the terminal. `` Cmd + `  `` on Mac or `` Ctrl + `  `` on Windows
2. Type this into the VSCode terminal. It creates a copy of this repo on your local machine.

    ```
    git clone https://github.com/harrynwosu/IDD.git
    ```

3. Once that runs, move into the project directory by typing this into the terminal:

    ```
    cd IDD
    ```

4. Run the following commands in order for the frontend:

    Move to the client/frontend directory

    ```
    cd client
    ```

    Installs all the necessary dependencies needed for the client code to work.

    ```
    npm install
    ```

    Start your local frontend development/test server.

    ```
    npm run dev
    ```

5. Once you start your frontend dev server you should see something like this:

    <img width="721" alt="image" src="https://github.com/user-attachments/assets/8715d813-6f17-4f19-8dde-9526df2730f6" />

    If you don't see this or run into any other issues along the way let me know.

8. Navigate to that blue link in your browser of choice, preferrably Chrome.

7. Go back to VS Code and open a new terminal tab.

8. In this new terminal tab, run the following commands in order for the backend:

    Move to the backend directory

    ```
    cd server
    ```

    Installs all the necessary dependencies needed for the backend code to work.

    ```
    npm install
    ```

    Start your local backend development/test server.

    ```
    npm start
    ```

7. Once you start your backend dev server you should see something like this:

    <img width="581" alt="image" src="https://github.com/user-attachments/assets/496d3ec2-ddd7-4e0f-97e3-6d5fdb2045d9" />


    If you don't see this or run into any other issues along the way let me know.

8. You should be all set to go now and make your frontend changes.

## Making Changes to the Main Site

> [!IMPORTANT]  
> You'll need write access to the repo, so hit me up for that. I'll try my best to respond asap.

To push your local changes to this main repo, take the following steps in the VSCode terminal:

> [!CAUTION]
> Please only push things that work, so as not to break things. For right now, I'll advise not making any changes tgo the backend code in the `server` directory unless you're confident in your changes.
>
> Try not to delete any other already existing stuff without confirming your changes with the rest of the team. If you're not entirely sure of your changes, feel free to reach out to me or Hector.

First, make sure your terminal in the root directory named `IDD` before continuing.

1. Before you make any new changes, it's a good rule of thumb to pull the latest version of the repo so as not to cause conflicts. Simply do this using this command in the terminal

    ```
    git pull
    ```

2. Add your current changes to the staging area.

    ```
    git add .
    ```

    Although not necessary, you can try this before the next step (committing) to see a list of the files that you modified or created, jsut to confirm it's what you intend.

    ```
    git status
    ```

3. Commit your changes. Replace `{anything goes here}` with a relevant commit message. It's not too important but try to make it a very short (few words) description of the changes you're about to push.

    ```
    git commit -m "{anything goes here}"
    ```

4. Push your changes to the remote repo.

    ```
    git push
    ```
