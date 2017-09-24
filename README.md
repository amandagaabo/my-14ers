# My 14ers App

## General Description
My 14ers is an app that will allow users to log which 14ers in Colorado they have summited.  The user can add 14ers by selecting the peak name and date completed.  The user can view a sortable photo list of completed 14ers or switch to a map view with all completed 14ers pinned.  Each pin can be clicked and will reveal details about that 14er.
 
## App Layout
* Header with logo and add peak button
* Body
  * Section - new user home page content
    * Photo
    * Welcome message
    * Add peak button
  * Section - add peak form
    * Form header  
    * Select peak dropdown
    * Select date
  * Navigation - list and map view toggle
  * Section - peak photo list
    * Sort dropdown
	  * Div for each peak
     * Photo of peak
     * Description including elevation, rank and date climbed
  * Section - map of peaks
    * Div for map
 
## Pages
* Home  / Photo List View
  * If no peaks have been logged, the user is prompted to add a completed peak
  * If peaks have been logged, a sortable photo list is displayed with buttons to switch to map view or add a peak
  * Local storage will be used to save user added peaks
 
* Map View
  * The map view will display a google map with pins at each completed peak
 
* Add a Completed Peak Form
  * Form where user can select the peak and date completed
  * Upon submit if there are errors the user will get a message, if no errors they will be taken back to the photo list
 
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
        imgAlt: "description of image",
        dateClimbed: YYYY-MM-DD
      }
    ]
  }
```

* All 14er data
  * An array will hold all the 14er data from the 14ers API
 
## Functions  - Display
* Start app - setup all sections, handle all button clicks, if user has peak log data in local storage show peak list section, if the user does not then show welcome section
* Hide content - hides all sections by applying hidden class, then remove hidden class for current section
* Show welcome section - nice 14er photo, welcome message and button to start tracking
* Handle start tracking button click - take user to the add peak form
* Show add peak section - header for form,  use <datalist> autocomplete dropdown to select peak, date input for selecting the date climbed
* Populate datalist - use 14er API data to get peak names and add them to datalist as options
* Handle form submit - check input and show error message if needed, show peak list section if form is submitted successfully
* Validate form - check that user entered required inputs, if not show error message
* Show peak list section - update navigation css for list, show photo list section
* Populate peak photo list - for each peak in the user peak log, show photo and text
* Handle add peak button click - button in nav used to add peaks, show add peak section
* Handle map nav button click - show map section
* Show map section - update navigation css for map,  show map section
* Handle map pin click - show peak name and info, photo too if possible
* Handle list tab click - show peak list section
*	Handle remove peak click - remove peak from user peak log and show show peak list page without the removed peak
*	Handle sort by click - sort list and update photo list section
* Handle logo click - show list section if data exists in local storage, show welcome section if no data

## Functions - Data Manipulation
*	Add peak - adds peak to the users peak log
* Get peak data - get data for individual peak that user is adding to their list
* Get peak photo - gets photo from flickr using lat and long from 14er get peak data request
*	Remove peak - removes peak from the users peak log
*	Sort by rank - sort list by rank
*	Sort by date completed - sort list by date climbed
*	Sort by peak name - sort list alphabetically by peak name
* Render map - Google map API, load full CO map view, add peaks
 
## Additional features if there is time
*	User login
* Handle climbing a peak more than once (add flag and both dates?)
*	Edit peaks in list
*	Show unclimbed peaks in list and/or on map
* User upload photo option, verify location if EXIF data exists
