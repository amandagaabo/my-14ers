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
      * Select date datepicker
	  * Section - peak photo list
	    * Tab navigation list/map
      * Sort dropdown
		  * Div for each peak
	     * Photo of peak
       * Description including elevation, rank, range and date climbed
    * Section - map of peaks
      * Tab navigation list/map
      * Div for map
 
## Pages
	* Home  / List View
	  * If no peaks have been logged, the user is prompted to add a completed peak
	    * If peaks have been logged, a sortable photo list is displayed with buttons to switch to map view or add a peak
	  * Local storage will be used to save user added peaks
 
	* Map View
    * The map view will display a google map
 
	* Add a Completed Peak
	  * Form where user can select the peak and date hiked
	  * Upon submit the user will get a success message then be taken back to the photo list
 
## Data
	* User peak log
	  * A constructor function will be used to create the array of logged peak data for the user
```
    Function peakLog() {
      this.peaks = [
        {
          name: "Mt. Princeton",
          elevation: 14197,
          rank: 20,
          range: "Sawatch",
          Lat: 38.749,
          Long: -106.2419,
          imgSrc: "https://linkforimage.com",
          imgAlt: "description of image",
          dateClimbed: mm/dd/yyyy
        }
      ]
    }
```
	  * const userPeaks = new peakLog(); will be used to define an object for a new users list of climbed peaks
	  * Prototype functions will be added to this function
	    * Add peak, remove peak, sort, filter, display peak list, display map

  * List of all 14er names
	  * An array will hold all the 14er names and will be used to populate/check the add 14er peak name input
	  * List will be alphabetical and can be created using the 14ers API
 
## Functions  - Display
	* Start app - if user has data in local storage render peak list, if the user does not then render new user home screen
	* Render new user home screen - nice 14er photo, welcome message and button to add a peak
  * Handle add peak click - take user to the add peak form
	* Render add peak form - header for form,  use <datalist> autocomplete dropdown to select peak, date picker for selecting the date climbed
	  * datalist example: http://blog.teamtreehouse.com/creating-autocomplete-dropdowns-datalist-element
	* Handle form submit - check input and show error message if needed, show success alert and render peak list page
	* Render peak list page - tab navigation for list and map with focus on list, add peak button at top, photo and text about each peak the user has climbed
	* Handle map tab click - render map page
	* Render map page - tab navigation for list and map changes focus to map, add peak button at top,  render map
	* Render map - Google map API, load full CO map view, add peaks to map - go to list and add peaks to map (use lat and long?)
	* Handle map pin click - show peak name and info, photo too if possible
	* Handle list tab click - render peak list page
	*	Handle remove peak click - render peak list page without the removed peak
	  * Mobile press and hold photo to see delete button
	  * Desktop hover over to see delete button
	*	Handle sort by click - sort list and render list page
  * Handle logo click - render list page if data exists in local storage, else render new user home

## Functions - Data Manipulation
	*	Add peak - adds peak to the users peak log
	*	Remove peak - removes peak from the users peak log
	*	Sort by rank - sort list by rank
	*	Sort by date climbed - sort list by date climbed
	*	Sort by peak name - sort list alphabetically by peak name
 
## Additional features if there is time
	*	User login
	*	Edit peaks in list
	*	Show unclimbed peaks in list and/or on map
