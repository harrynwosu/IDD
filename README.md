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

-   The `components` directory contains the building blocks used for the site.
-   The `pages` directory contains the layout of the different pages (Home, About, Services, etc.). It basically uses the building blocks from `components` to lay the different pages out.
-   The `styles` directory contains CSS styles for almost everything. Each component/page might have its own styles file which defines the styles used in that file.
-   The `server` directory mostly contains backend code including the backend API routes, PostgreSQL database setup, and logic for other necessary functionalities for the site as it relates to handling data, such as processing the provider data, getting their location on the map (latitude and longitude) through a process called geocoding, and parsing this data as JSON. It kind of semi-automated for now.

> [!NOTE]
> To update the provider directory, simply update the csv file at `server/data/combined_service_providers.csv`, then run the geocoding job via the command `node geocodeJob.js` in the terminal. It takes a couple minutes to complete, so please be patient. I'd say give it about 30 minutes - 1 hour.
>
> For local development, the terminal command `node server.js` should get the server running on PORT 4000.

## Testing

For testing purposes for now, follow the following steps

1. Open VSCode and open the terminal. `` Cmd + `  `` on Mac or `` Ctrl + `  `` on Windows
2. Type this into the VSCode terminal. It creates a copy of this repo on your local machine.

    ```
    git clone https://github.com/harrynwosu/IDD.git
    ```

3. Once that runs, move into the project directory by typing this into the terminal:

    ```
    cd IDD
    ```

4. Run the following commands in order:

    This installs all the necessary dependencies needed for the code to work.

    ```
    npm install
    ```

    This starts your local development/test server.

    ```
    npm run dev
    ```

5. Once you start your dev server you should see something like this:

    <img width="721" alt="image" src="https://github.com/user-attachments/assets/8715d813-6f17-4f19-8dde-9526df2730f6" />

    If you don't see this or run into any other issues along the way let me know.

6. Navigate to that blue link in your browser of choice, preferrably Chrome.

## Things to Note

1. I currently have very little work done since most of my time was spent on starting things up. Navigate to the `Services` page to view what we have so far.
2. You might need to create your own Google Maps API key to see the map on the `Services` page. We just have a standard map centered at Chicago for now as a placeholder. That requires a whole different process of setup but I might be able to help if you need to see it and run into any problems getting it to work.
3. This is what it looks like on my machine at the moment:

> [!NOTE]  
> Recently switched to OpenStreetMaps (OSM) which is free instead of the Google Maps API that may incure costs in the long run, since this is just a placeholder anyway. So the current map might look a little different from what you see below

<img width="1439" alt="image" src="https://github.com/user-attachments/assets/c1523e7c-de89-47b4-8994-f15454b430a3" />

<img width="1431" alt="image" src="https://github.com/user-attachments/assets/5b3de176-b678-4552-8f89-2f3791ef3f3e" />

## Making Changes to the Main Site

> [!IMPORTANT]  
> You'll need write access to the repo, so hit me up for that. I'll try my best to respond asap.

To push your local changes to this main repo, take the following steps in the VSCode terminal:

> [!CAUTION]
> Please only push things that work, so as not to break things. Try not to delete any already existing stuff without confirming your changes with the rest of the team. If you're not entirely sure of your changes, feel free to reach out to me.

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
