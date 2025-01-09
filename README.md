## About
This project is an image generator that allows users to create a visual representation of their travel itinerary. The application automatically groups neighboring "Destinations" with the same "Locations", nesting them under the same list item. This feature enables users to view their itinerary at a glance, providing a clear and organized overview of their travel plans.

### Features
- **Automatic Grouping**: Neighboring "Destinations" with the same "Locations" are automatically grouped together.
- **Nested Items**: New inputs for "Destination" or "Meal" are nested under the previous "Location".
- **Downloadable Image**: The generated itinerary can be downloaded as an image for offline use.
- **Dynamic Updates**: The itinerary updates dynamically as users add or modify their travel plans.
- **Date and Day Separation**: The day number, date, and day of the week are displayed separately for clarity.
- **Active Day Highlight**: The border of the day container being edited is highlighted for better user experience.
- **Import and Export**: Users can import and export their itinerary data for easy sharing and backup.

### How to Use
1. **Add a Day**: Click the "Add Day" button to add a new day to your itinerary.
2. **Add Locations and Destinations**: For each day, you can add locations and destinations. Click the "Add Location" button to add a new location. Under each location, you can add destinations, meals, and transportation details.
3. **Edit Details**: Click on any input field to edit the details. The border of the active day container will be highlighted.
4. **Move Items**: Use the up and down arrows to move locations and destinations within the itinerary.
5. **Delete Items**: Click the trash icon to delete a day, location, or destination.
6. **Import and Export**: Use the "Import" button to import itinerary data from a file. Use the "Export" button to export your itinerary data to a file.
7. **Download Image**: Click the "Download" button to download the itinerary as an image. You can choose to download it as a PNG or PDF file.

### References
#### Graphics
- Favicon: [Customer journey icons](https://www.flaticon.com/free-icon/destination_8221211?term=itinerary&related_id=8221211) created by [Icon Hubs](https://www.flaticon.com/authors/icon-hubs) - Flaticon
- Layout: [Fiori for Android Design Guidelines](https://experience.sap.com/fiori-design-android/2020/06/)
- Font: [DM Sans](https://fonts.google.com/share?selection.family=DM+Sans:ital,opsz,wght@0,9..40,100..1000;1,9..40,100..1000)
- Icons: [Font Awesome](https://fontawesome.com) | [Icons Reference](https://www.w3schools.com/icons/icons_reference.asp)

#### Code
The code was entirely built using Artificial Intelligence (AI) tools as @ABagram currently has limited knowledge on JavaScript, which could impact the functionality and greatly reduce the quality of the user experience (UX). She thought that she could immediately make use of the website if it were developed to cater to her intended use.

The starting code was made using OpenAI's ChatGPT, while the majority of the edits and features (e.g., JavaScript) were primarily made using GitHub Copilot (GPT 4o). The prompts are completely directed by @ABagram.

##### Citations by Github Copilot
  - [html2canvas](https://cdnjs.cloudflare.com/ajax/libs/html2canvas/1.4.1/html2canvas.min.js)
  - [jspdf](https://cdnjs.cloudflare.com/ajax/libs/jspdf/2.4.0/jspdf.umd.min.js)
  - [Font Awesome](https://kit.fontawesome.com/9ef70a0feb.js)