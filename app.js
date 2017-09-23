'use strict'
/**
* peakData is used to save all data for each peak from the 14er AIP
*/
const peakData = []

/**
* User peak log is used to store completed peak data for the user.
*/
const userPeakLog = []

const testData = {
  peakname: 'Mt. Yale',
  elevation: '14,100',
  rank: 30,
  range: 'Sawatch',
  lat: 38.749,
  long: -106.2419,
  imgSrc: 'https://image.ibb.co/ch7Q15/mountain_photo.jpg',
  imgAlt: 'Mt. Princeton image',
  dateClimbed: '2016-12-25'
}
userPeakLog.push(testData)

/**
* Start the app.
* - Get peak data from 14er API if not in local storage, then save to local storage
* - Handle all button clicks
* - showWelcomePage() function is called if local storage is empty
* - showPeakList() function is called if data is in local storage
*/
function startApp () {
  // get 14er data
  if (!localStorage.getItem('peakData')) {
    console.log('getting peak list from 14er API and saving to local storage')
  }

  // get data and populate datalist dropdown in add peak form
  if($('#peak-list > option').length === 0) {
    populateDatalist()
  }

  // handle all clicks
  handleLogoClick()
  handleStartTrackingBtnClick()
  handleSubmitForm()
  handleNavMapBtnClick()
  handleNavListBtnClick()
  handleRemovePeakBtnClick()
  handleAddPeakBtnClick()
  handleSortByClick()

  // show welcome page or peak list depending on what is in local storage
  if (!localStorage.getItem('userPeakLog')) {
    console.log('no local storage, show welcome section')
    showWelcomeSection()
  // }
  // else {
  //  console.log('user has peak log in local storage, show peak list section')
    sortByDateClimbed()
    updatePeakPhotoList()
    renderMap()
  // showPeakList()
  }

}

/**
* Handle logo click.
* - logo ID: #logo
* - show list of peaks section if user has data in local storage, else show welcome section
*/
function handleLogoClick () {
  $('#logo').click(function () {
    console.log('logo clicked')
  })
}

/** Hide content.
* - Hide all content sections
* - Sections class = content
* - Add class = hidden
*/
function hideContent () {
  $('.content').addClass('hidden')
}

/**
* Show welcome section.
* - Hide all sections - hideContent()
* - Remove class = hidden from welcome page section - ID: #welcome-section
*/
function showWelcomeSection () {
  console.log('show: welcome section')
  hideContent()
  $('#welcome-section').removeClass('hidden')
}

/**
* Handle start tracking button click.
* - Button ID: #start-tracking-btn
* - Show add peak form page - showAddPeakSection()
*/
function handleStartTrackingBtnClick () {
  $('#start-tracking-btn').click(function () {
    console.log('start tracking button clicked')
    showAddPeakSection()
  })
}

/**
* Show the add peak section.
* - Hide all sections - hideContent()
* - Show add peak section - ID: #add-peak-section
*/
function showAddPeakSection () {
  console.log('show: add peak section')
  hideContent()
  $('#add-peak-section').removeClass('hidden')
}

/**
* Populate Datalist.
* - Get request to 14er API to get list of all peak names
* - Sort alphabetically in an array
* - For each peak name, add an option in the datalist - ID: #peak-list
*/
function populateDatalist () {
  // sample peakList, use API data in peakData to make array of peak names
  console.log('datalist populated')
  const peakList = ['Mt. Princeton', 'Longs Peak', 'Mt. Elbert']
  peakList.sort()

  peakList.forEach(peak => {
    $('#peak-datalist').append(`<option value='${peak}'>`)
  })
}

/**
* Handle submit form.
* - Form ID: #add-peak-form
* - Validate form - validateForm()
* - Prevent default
* - Clear form inputs
* - Add peak to userPeakLog - addPeak()
* - Update peak photo list - updatePeakPhotoList()
* - Update peak map - renderMap()
* - Show peak list page - showPeakListSection()
*/
function handleSubmitForm () {
  $('#add-peak-form').submit(function (event) {
    event.preventDefault()

    if (validateForm()) {
      console.log('form submitted, adding data to userPeakLog')
      let peakName = $('#peak-climbed').val()
      let date = $('#date-climbed').val()
      addPeak(peakName, date)
      sortByDateClimbed()
      updatePeakPhotoList()
      renderMap()

      $('#peak-climbed').val('')
      $('#date-climbed').val('')
      $('#error-message').html('')

      showPeakListSection()
    }
  })
}

/**
* Validate form.
* - check that all inputs are entered
* - show error message if inputs are missing
*/
function validateForm () {
  $('#error-message').html('')

  let peakName = $('#peak-climbed').val()
  let dateString = $('#date-climbed').val()
  let dateClimbed = new Date(dateString)
  let message = null
  let today = new Date()
  let minYear = today.getFullYear() - 100

  if (!peakName && !dateClimbed) {
    message = 'Please select peak name and date climbed.'
  }
  else if (!peakName) {
    message = 'Please select peak name.'
  }
  else if (!dateClimbed) {
    message = 'Please select date climbed.'
  }
  else if (dateClimbed > today || dateClimbed.getFullYear() < minYear) {
    message = 'Please select valid date.'
  }

  if (message) {
    $('#error-message').html(`${message}`)
  }
  else {
    return true
  }
}

/**
* Show peak list section.
* - Hide all content sections - hideContent()
* - Show header add peak button - ID: #add-peak-btn
* - Show navigation section - ID: #navigation-section
* - Show peak list page section - ID: #peak-list-section
* - Toggle selected class from #map-btn to #list-btn
*/
function showPeakListSection () {
  console.log('show: peak list section')
  hideContent()
  $('#add-peak-btn, #navigation-section, #peak-list-section').removeClass('hidden')
  $('#list-btn').addClass('selected')
  $('#map-btn').removeClass('selected')
}

/**
* Update peak photo list.
* - Clear out existing peak list section - ID: #peak-photo-list
* - Generate HTML for each peak in userPeakLog
* - Add HTML to peak photo list - ID: #peak-photo-list
*/
function updatePeakPhotoList () {
  $('#peak-photo-list').html('')

  userPeakLog.forEach(peak => {
    let date = new Date(peak.dateClimbed)
    let day = date.getDate() + 1
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let convertedDate = `${month}-${day}-${year}`

    $('#peak-photo-list').append(`
      <div class="col-6">
        <div class="mountain-box">
          <img src="${peak.imgSrc}" alt="${peak.imgAlt}" class="mountain-photo">
          <div class="caption">
            <h2 class="caption-header" data-peak="${peak.peakname}">${peak.peakname} - ${peak.elevation}</h2>
            <p class="caption-details">Rank: ${peak.rank}</p>
            <p class="caption-details">Date climbed: ${convertedDate}</p>
            <button class="button remove-peak">x</button>
          </div>
        </div>
      </div>
      `)
  })
}

/**
* Handle sort by click
* - Sort dropdown ID: #sort-by
* - Find out which option the user selected
* - Call sort function based on selection
* - Re-generate peak list in new order - updatePeakPhotoList()
*/
function handleSortByClick () {
  $('#sort-by').change(function () {
    let userSort = $('#sort-by option:selected').val()
    //console.log(userSort)
    if (userSort === 'date-climbed') {
      sortByDateClimbed()
    }
    if (userSort === 'peak-name') {
      sortByPeakName()
    }
    if (userSort === 'peak-rank') {
      sortByRank()
    }

    updatePeakPhotoList()
  })
}

/**
* Handle add peak button click.
* - Add peak button ID: #add-peak-btn
* - Render add peak form page - showAddPeakSection()
*/
function handleAddPeakBtnClick () {
  $('#add-peak-btn').click(function () {
    showAddPeakSection()
  })
}

/**
* Handle navigation map button click.
* - Map nav button ID: #map-btn
* - Show peak map section - showPeakMapSection()
*/
function handleNavMapBtnClick () {
  $('#map-btn').click(function () {
    console.log('map nav button clicked')
    showPeakMapSection()
  })
}

/**
* Show peak map section.
* - Hide all content sections - hideContent()
* - Show header add peak button - ID: #add-peak-btn
* - Show navigation section - ID: #navigation-section
* - Show peak map section - ID: #peak-map-section
* - Toggle selected class from #list-btn to #map-btn
*/
function showPeakMapSection () {
  console.log('show: peak map section')
  hideContent()
  $('#add-peak-btn, #navigation-section, #peak-map-section').removeClass('hidden')
  $('#list-btn').removeClass('selected')
  $('#map-btn').addClass('selected')
}

/**
* Handle navigation list button click.
* - List button ID: #list-btn
* - Show peak list section - showPeakListSection()
*/
function handleNavListBtnClick () {
  $('#list-btn').click(function () {
    console.log('list nav button clicked')
    showPeakListSection()
  })
}

/**
* Handle remove peak button click.
* - Use parent div to find button that was added after page load - ID: #peak-list-page
* - Button class = .remove-peak
* - find out neam of peak being removed - class: .caption-header data-peak attribute
* - remove peak from user log & update local storage - removePeak()
* - update peak photo list - updatePeakPhotoList()
* - update map - renderMap()
*/
function handleRemovePeakBtnClick () {
  $('#peak-list-section').on('click', '.remove-peak', function () {
    let peakDiv = $(this).parent().parent().parent()
    let index = $('#peak-photo-list > div').index(peakDiv)
    console.log('remove peak x clicked, peak removed.'
    removePeak(index)
    updatePeakPhotoList()
    renderMap()
  })
}

/**
* Add peak.
* - Get peak data from 14er API using peak name user selected - datalist ID: #peak-list
* - Get peak photo from flickr API using lat and long from peak data
* - Add peak photo and alt to peak data
* - Push peak data to user peak log
* - Update local storage
*/

function addPeak (peakName, date) {
  let peakData = getPeakData(peakName)
  let lat = peakData.lat
  let long = peakData.long
  let peakPhotoInfo = getPeakPhoto(lat, long)
  peakData.imgSrc = peakPhotoInfo.imgSrc
  peakData.imgAlt = peakPhotoInfo.imgAlt
  peakData.dateClimbed = date
  userPeakLog.push(peakData)
  console.log(userPeakLog)
}

/**
* Get peak data.
* - Use peak name to sort peakData array and push into userPeakLog
*/
function getPeakData (peakName) {
  // let peakData = {}
  // Data needed from API
  // peakData.peakname
  // peakData.elevation
  // peakData.rank
  // peakData.range
  // peakData.lat
  // peakData.long
  // return peakData

  const sampleData = {
        peakname: 'Mt. Princeton',
        elevation: "14,197",
        rank: 20,
        range: 'Sawatch',
        lat: 38.749,
        long: -106.2419
      }
  return sampleData
}

/**
* Get peak photo.
* - Get request to flikr API for photo of peak using lat and long
*/
function getPeakPhoto (lat, long) {
  const samplePhotoData = {
    imgSrc: 'https://image.ibb.co/ch7Q15/mountain_photo.jpg',
    imgAlt: 'Mt. Princeton image'
  }

  return samplePhotoData
}

/**
* Remove peak.
* - Remove peak from userPeakLog
* - Update local storage
*/
function removePeak (index) {
  console.log('peak removed')
  //console.log(index)
  userPeakLog.splice(index, 1)
}

/**
* Sort by date completed.
* - Sort userPeakLog by date completed
*/
function sortByDateClimbed () {
  console.log('sorted by date climbed')
  userPeakLog.sort((a, b) => new Date(b.dateClimbed) - new Date(a.dateClimbed))
}

/**
* Sort by peak rank.
* - Sort userPeakLog by rank
*/
function sortByRank () {
  console.log('sorted by rank')
  userPeakLog.sort((a, b) => a.rank - b.rank)
}

/**
* Soft by peak name.
* - Sort userPeakLog by peak name
*/
function sortByPeakName () {
  console.log('sorted by peak name')
  userPeakLog.sort(function (a, b) {
    if (a.peakname < b.peakname) {
      return -1
    }
    if (b.peakname < a.peakname) {
      return 1
    }
    return 0
  })
}

/**
* Render map.
* - Use Google maps API to render map of CO
* - Display pins at each completed peak using lat and long from userPeakLog
* - Enable info pop-up on click for pins
*/
function renderMap () {
  console.log('map rendered')
}

$(startApp)
