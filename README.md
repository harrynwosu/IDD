# IDD Project Site

## Overview

For right now, you should only be worried about the following files/directories:

```
src/
├── components/
├── pages/
├── styles/
├── App.jsx
├── App.css
└── main.jsx
```

- The `components` directory contains the building blocks used for the site
- The `pages` directory contains the layout of the different pages (Home, About, Services, etc.). It basically uses the building blocks from `components` to lay the different pages out.
- The `styles` directory contains CSS styles for almost everything. Each component/page might have its own styles file which defines the styles used in that file.


## Testing

For testing purposes for now, follow the following steps

1. Open VSCode and open the terminal. ``Cmd + ` ``  on Mac or  ``Ctrl + ` ``   on Windows
   
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

<img width="1439" alt="image" src="https://github.com/user-attachments/assets/c1523e7c-de89-47b4-8994-f15454b430a3" />



<img width="1431" alt="image" src="https://github.com/user-attachments/assets/5b3de176-b678-4552-8f89-2f3791ef3f3e" />




   



