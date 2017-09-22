'use strict'
/**
* Peak log is the constructor function for the users peak log
* Functions associated with peak log data manipulation will be prototypes.
*/
function PeakLog () {
  this.peaks = []
}

/**
* User peak log is used to store completed peak data for the user.
* Functions associated with peak log data manipulation will be prototypes.
*/
const userPeakLog = new PeakLog()
const testData = {
      peakname: 'Mt. Yale',
      elevation: "14,100",
      rank: 30,
      range: 'Sawatch',
      lat: 38.749,
      long: -106.2419,
      imgSrc: 'https://image.ibb.co/ch7Q15/mountain_photo.jpg',
      imgAlt: 'Mt. Princeton image',
      dateClimbed: '2016-12-25'
    }
userPeakLog.peaks.push(testData)
/**
* Start the app.
* - renderWelcomePage() function is called if local storage is empty
* - renderPhotoList() function is called if data is in local storage
*/
function startApp () {
  if (!localStorage.getItem('userPeakLog')) {
    console.log('no local storage, render welcome page')
    handleLogoClick()
    hideContent()
    renderWelcomePage()
  }
}

/**
* Handle logo click.
* - logo ID: #logo
* - startApp() to decide what to load
*/
function handleLogoClick () {
  $('#logo').click(function () {
    startApp()
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
* Render welcome page.
* - Hide all sections - hideContent()
* - Remove class = hidden from welcome page section - ID: #welcome-page
* - Handle start tracking button click - handleStartTrackingBtnClick()
*/
function renderWelcomePage () {
  console.log('welcome page rendered')
  $('#welcome-page').removeClass('hidden')
  handleStartTrackingBtnClick()
}

/**
* Handle start tracking button click.
* - Button ID: #start-tracking-btn
* - Render add peak form page - renderAddPeakPage()
*/
function handleStartTrackingBtnClick () {
  $('#start-tracking-btn').click(function () {
    console.log('start tracking button clicked')
    renderAddPeakPage()
  })
}

/**
* Render the add peak form page.
* - Populate datalist options if the list is empty - populateDatalist()
* - Hide all sections - hideContent()
* - Show add peak section - ID: #add-peak-page
* - Handle submit button click - handleSubmitForm()
*/
function renderAddPeakPage () {
  console.log('add peak page rendered')
  if($('#peak-list > option').length === 0) {
    populateDatalist()
  }

  hideContent()
  $('#add-peak-page').removeClass('hidden')
  handleSubmitForm()
}

/**
* Populate Datalist.
* - Get request to 14er API to get list of all peak names
* - Sort alphabetically in an array
* - For each peak name, add an option in the datalist - ID: #peak-list
*/
function populateDatalist () {
  const peakList = ['Mt. Princeton', 'Longs Peak', 'Mt. Elbert']
////////NEED TO GET ALL PEAK NAMES FROM API///////////////////////
  peakList.sort()

  peakList.forEach(peak => {
    $('#peak-list').append(`<option value='${peak}'>`)
  })
}

/**
* Handle submit form.
* - Form ID: #add-peak-form
* - Validate form - validateForm()
* - Prevent default
* - Clear form inputs
* - Add peak to userPeakLog - addPeak()
* - Render list page - renderPeakList()
*/
function handleSubmitForm () {
  $('#add-peak-form').submit(function (event) {
    event.preventDefault()

    if (validateForm()) {
      console.log('form submitted')
      let peakName = $('#peak-climbed').val()
      let date = $('#date-climbed').val()
      addPeak(peakName, date)

      $('#peak-climbed').val('')
      $('#date-climbed').val('')
      $('#error-message').html('')

      renderPeakList()
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
* Render peak list page.
* - Hide all content sections - hideContent()
* - Show header add peak button - ID: #add-peak-btn
* - Show navigation section - ID: #navigation
* - Show peak list page section - ID: #peak-list-page
* - Toggle selected class from #map-btn to #list-btn
* - Sort peaks by date climbed - sortByDateClimbed()
* - Populate list content - populatePeakListSection()
* - Handle navigation map button click - handleNavMapBtnClick()
* - Handle remove peak button click - handleRemovePeakBtnClick()
* - Handle add peak button click - handleAddPeakBtnClick()
* - Handle sort by dropdown click - handleSortByClick()
*/
function renderPeakList () {
  console.log('peak list page rendered')
  hideContent()
  $('#add-peak-btn, #navigation, #peak-list-page').removeClass('hidden')
  $('#list-btn').addClass('selected')
  $('#map-btn').removeClass('selected')
  sortByDateClimbed()
  populatePeakListSection()
  handleNavMapBtnClick()
  handleRemovePeakBtnClick()
  handleAddPeakBtnClick()
  handleSortByClick()
}

/**
* Populate peak list section.
* - Clear out existing peak list section - ID: #peak-list-section
* - Generate HTML for each peak in userPeakLog
* - Add HTML to peak list section - ID: #peak-list-section
*/
function populatePeakListSection () {
  $('#peak-list-section').html('')

  userPeakLog.peaks.forEach(peak => {
    let date = new Date(peak.dateClimbed)
    let day = date.getDate() + 1
    let month = date.getMonth() + 1
    let year = date.getFullYear()
    let convertedDate = `${month}-${day}-${year}`
    $('#peak-list-section').append(`
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
* - Re-generate peak list in new order - populatePeakListSection()
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

    populatePeakListSection()
  })
}

/**
* Handle add peak button click.
* - Add peak button ID: #add-peak-btn
* - Render add peak form page - renderAddPeakPage()
*/
function handleAddPeakBtnClick () {
  $('#add-peak-btn').click(function () {
    renderAddPeakPage()
  })
}

/**
* Handle navigation map button click.
* - Map nav button ID: #map-btn
* - Render peak map page - renderPeakMapPage()
*/
function handleNavMapBtnClick () {
  $('#map-btn').click(function () {
    console.log('map nav button clicked')
    renderPeakMapPage()
  })
}

/**
* Render peak map page.
* - Hide all content sections - hideContent()
* - Show header add peak button - ID: #add-peak-btn
* - Show navigation - ID: #navigation
* - Show peak map section - ID: #peak-map
* - Toggle selected class from #list-btn to #map-btn
* - Render map with pins at peaks - renderMap()
* - Handle navigation list button click - handleNavListBtnClick()
* - Handle add peak button click - handleAddPeakBtnClick()
*/
function renderPeakMapPage () {
  console.log('peak map page rendered')
  hideContent()
  $('#add-peak-btn, #navigation, #peak-map').removeClass('hidden')
  $('#list-btn').removeClass('selected')
  $('#map-btn').addClass('selected')
  renderMap()
  handleNavListBtnClick()
  handleAddPeakBtnClick()
}

/**
* Handle navigation list button click.
* - List button ID: #list-btn
* - Render list page - renderPeakList()
*/
function handleNavListBtnClick () {
  $('#list-btn').click(function () {
    console.log('list nav button clicked')
    renderPeakList()
  })
}

/**
* Handle remove peak button click.
* - Use parent div to find button that was added after page load - ID: #peak-list-page
* - Button class = .remove-peak
* - find out neam of peak being removed - class: .caption-header data-peak attribute
* - remove peak from user log - removePeak()
* - update peak list - populatePeakListSection()
*/
function handleRemovePeakBtnClick () {
  $('#peak-list-page').on('click', '.remove-peak', function () {
    let peakName = $(this).siblings('.caption-header').data('peak')
    console.log('remove peak x clicked.', peakName, 'will be removed')
    removePeak(peakName)
    populatePeakListSection()
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
  userPeakLog.peaks.push(peakData)
  console.log(userPeakLog)
}

/**
* Get peak data.
* - Get request to 14er API for data on peak by peakName
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
function removePeak (peakName) {

}

/**
* Sort by date completed.
* - Sort userPeakLog by date completed
*/
function sortByDateClimbed () {
  //console.log('sorted by date climbed')
  userPeakLog.peaks.sort((a, b) => new Date(b.dateClimbed) - new Date(a.dateClimbed))
}

/**
* Sort by peak rank.
* - Sort userPeakLog by rank
*/
function sortByRank () {
  // console.log('sorted by rank')
  userPeakLog.peaks.sort((a, b) => a.rank - b.rank)
}

/**
* Soft by peak name.
* - Sort userPeakLog by peak name
*/
function sortByPeakName () {
  console.log('sorted by peak name')
  userPeakLog.peaks.sort(function (a, b) {
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

}

$(startApp)
