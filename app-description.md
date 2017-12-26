# My 14ers App Description
The following information summarizes what the app is and how the it was designed from an HTML/CSS/JS standpoint.

## General Description
My 14ers is an app that will allow users to log which 14ers in Colorado they have summited.  The user can add 14ers by selecting the peak name and date completed.  The user can view a sortable photo list of completed 14ers or switch to a map view with all completed 14ers pinned.  Each pin can be clicked and will reveal details about that 14er.
 
## App Layout
* Header with logo and add peak button
* Body
  * Section - home page
    * New user
      * Photo
      * Welcome message
      * Add start tracking button
    * Existing user
      * Percent of peaks climbed summary
  * Section - add peak form
    * Form header  
    * Select peak dropdown
    * Select date
  * Section - peak photo list
    * Sort dropdown
	  * Div for each peak
     * Photo of peak
     * Description including elevation, rank and date climbed
  * Section - map of peaks
    * Div for map
 
## Pages
* Home
  * If no peaks have been logged, a welcome message is shown and the user is prompted to add a completed peak
  * If peaks have been logged, a summary of completion will be show
  * Local storage will be used to save user added peaks

* Add Peak
  * Form where user can select the peak and date completed
  * Upon submit if there are errors the user will get a message, if no errors they will be taken back to the photo list

* List of Peaks
  * Sortable photo list of completed peaks

* Map of Peaks
  * Google map with pins at each completed peak
  * Click on the pin for more info about the peak
 

## Data
* User peak log
  * An array of objects store logged peak data for the user
```
  const userPeakLog = [
      {
        peak_name: "Mt. Princeton",
        elevation: 14197,
        rank: 20,
        range: "Sawatch",
        latitude: 38.749,
        longitude: -106.2419,
        imgSrc: "https://linkforimage.com",
        dateClimbed: "YYYY-MM-DD"
      }
    ]
  }
```

* All 14er data
  * An array will hold all the 14er data from the 14ers API
 
## Functions  - Display
General
* Start app - setup all sections, handle all clicks, show home section
* Hide content - hides all sections by applying hidden class, then remove hidden class for current section
* Update progress section - calculate percent complete and update circle chart and text
* Populate peak photo list - for each peak in the user peak log, show photo and text
* Populate datalist - use 14er API data to get peak names and add them to datalist as options
* Enable date picker - for browsers that don't support input type="date", use jQuery datepicker()
* Validate peak - check user peak input, show error message if invalid
* Validate date - check user date input, show error message if invalid
Show sections
* Show home section - update nav css, show home section - welcome message if no local storage, else shoe percent complete summary
* Show add peak section - update nav css, show add peak form section
* Show peak list section - update nav css, show photo list section
* Show map section - update nav css, show map section
Handle clicks
* Handle logo click - show home section
* Handle home nav button click - show home section
* Handle add peak nav button click - show add peak section
* Handle list nav button click - show peak list section
* Handle map nav button click - show map section
*	Handle remove peak click - remove peak from user peak log and show show peak list page without the removed peak
*	Handle sort by click - sort list and update photo list section
* Handle form submit - validate inputs, show peak list section if form is submitted successfully, else show error messages

## Functions - Data Manipulation
*	Add peak - adds peak to the users peak log
* Get peak data - get data for individual peak that user is adding to their list
*	Remove peak - removes peak from the users peak log
*	Sort by rank - sort list by rank
*	Sort by date completed - sort list by date climbed
*	Sort by peak name - sort list alphabetically by peak name
* Render map - Google map API, load full CO map view, add peak pins with infowindows
 
## Additional features if there is time
*	User login
*	Edit peaks in list
*	Show unclimbed peaks in list and/or on map for future planning
* User upload photo option
