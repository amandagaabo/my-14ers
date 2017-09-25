'use strict'
// localStorage.removeItem('userPeakLog')

/**
* User peak log is used to store completed peak data for the user.
*/
let userPeakLog = []

/**
* Start the app.
* - Populate form datalist
* - Handle all button clicks
* - showWelcomeSection() function is called if local storage is empty
* - showPeakListSection() function is called if data is in local storage
* - Sort peak data and update peak photo list and map before showing peak list section
*/
function startApp () {
  // populate datalist in add peak form
  populateDatalist()

  // handle all clicks
  handleStartTrackingBtnClick()
  handleSubmitForm()
  handleNavMapBtnClick()
  handleNavListBtnClick()
  handleRemovePeakBtnClick()
  handleAddPeakBtnClick()
  handleSortByClick()

  // show welcome section or peak list section depending on what is in local storage
  if (!localStorage.getItem('userPeakLog') || JSON.parse(localStorage.getItem('userPeakLog')).length === 0) {
    console.log('no local storage, show welcome section')
    showWelcomeSection()
  }
  else {
    console.log('user has peak log in local storage, show peak list section')

    userPeakLog = JSON.parse(localStorage.getItem('userPeakLog'))
    console.log(userPeakLog)
    sortByDateClimbed()
    updatePeakPhotoList()
    showPeakListSection()
  }

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
* - Get peak names from API data saved in peakList
* - Sort alphabetically in an array
* - For each peak name, add an option in the datalist - ID: #peak-list
*/
function populateDatalist () {
  const peakList = []
  peakData.forEach(peak => peakList.push(peak.attributes.peak_name))
  peakList.sort()
  peakList.forEach(peak => {
    $('#peak-datalist').append(`<option value='${peak}'>`)
  })
  console.log('datalist populated')
}

/**
* Handle submit form.
* - Form ID: #add-peak-form
* - Validate form - validateForm()
* - Prevent default
* - Clear form inputs
* - Add peak to userPeakLog - addPeak()
* - Update peak photo list - updatePeakPhotoList()
* - Show peak list page - showPeakListSection()
*/
function handleSubmitForm () {
  $('#add-peak-form').submit(function (event) {
    event.preventDefault()

    if (validateForm()) {
      console.log('form submitted, adding data to userPeakLog')
      let peakName = $('#peak-climbed').val()
      let date = $('#date-climbed').val()
      console.log('date value from form')
      addPeak(peakName, date)
      sortByDateClimbed()
      $('#sort-by').prop('selectedIndex',0);
      updatePeakPhotoList()

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
  let dateClimbed = $('#date-climbed').val()
  let message = null
  let today = moment(new Date()).format('YYYY-MM-D')
  let minusHundredYears = moment(today).subtract(100,'years').format('YYYY-MM-D')
  console.log('dateClimbed:', dateClimbed, 'today', today, 'today minus 100 years', minusHundredYears)

  if (!peakName && !dateClimbed) {
    message = 'Please select peak name and date climbed.'
  }
  else if (!peakName) {
    message = 'Please select peak name.'
  }
  else if (!dateClimbed) {
    message = 'Please select date climbed.'
  }
  else if (!moment(dateClimbed).isBetween(minusHundredYears, today, null,'[]')) {
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
    let convertedDate = moment(peak.dateClimbed).format('MMM D, YYYY')

    $('#peak-photo-list').append(`
      <div class="col-4">
        <div class="mountain-box">
          <img src="${peak.imgSrc}" alt="${peak.peak_name} photo" class="mountain-photo">
          <div class="caption">
            <h2 class="caption-header" data-peak="${peak.peak_name}">${peak.peak_name} - ${peak.elevation}</h2>
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
* - Render map - renderMap()
*/
function showPeakMapSection () {
  console.log('show: peak map section')
  hideContent()
  $('#add-peak-btn, #navigation-section, #peak-map-section').removeClass('hidden')
  $('#list-btn').removeClass('selected')
  $('#map-btn').addClass('selected')
  renderMap()
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
*/
function handleRemovePeakBtnClick () {

  $('#peak-list-section').on('click', '.remove-peak', function () {
    if(confirm('Are you sure you want to remove this peak?')) {
      let peakDiv = $(this).parent().parent().parent()
      let index = $('#peak-photo-list > div').index(peakDiv)
      console.log('remove peak x clicked, peak removed.')
      removePeak(index)
      updatePeakPhotoList()
    }
  })
}

/**
* Add peak.
* - Get peak data from 14er API using peak name user selected
* - Get peak photo from flickr API using lat and long from peak data
* - Add peak photo and alt to peak data
* - Push peak data to user peak log
* - Update local storage
*/

function addPeak (peakName, date) {
  let addedPeakData = getPeakData(peakName)
  addedPeakData.dateClimbed = date
  userPeakLog.push(addedPeakData)
  console.log(userPeakLog)

  let savedUserPeakLog = JSON.stringify(userPeakLog);
  localStorage.setItem('userPeakLog', savedUserPeakLog);
}

/**
* Get peak data.
* - Use peak name to find peakName in peakData and push into userPeakLog
*/
function getPeakData (peakName) {
  let allPeakData = peakData.filter(peak => peak.attributes.peak_name === peakName)
  let modifiedPeakData = Object.assign({}, allPeakData[0].attributes);

  console.log('got peak data to add to userPeakLog:', modifiedPeakData)
  return modifiedPeakData
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

  let savedUserPeakLog = JSON.stringify(userPeakLog);
  localStorage.setItem('userPeakLog', savedUserPeakLog);
}

/**
* Sort by date completed.
* - Sort userPeakLog by date completed
*/
function sortByDateClimbed () {
  console.log('sorted by date climbed')
  userPeakLog.sort((a, b) => {
    let dateA = moment(a.dateClimbed).unix()
    let dateB = moment(b.dateClimbed).unix()
    return dateB - dateA
  })
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
    if (a.peak_name < b.peak_name) {
      return -1
    }
    if (b.peak_name < a.peak_name) {
      return 1
    }
    return 0
  })
}


/**
* Initiate google map
*/
function initMap() {
  console.log('map initiated')
}

/**
* Render map
* - Show map of colorado
* - Add pins that are in userPeakLog
*/
let map
function renderMap() {
  console.log('map rendered with pins in userPeakLog')

  let colorado = {lat: 39.0051, lng: -105.5197}
  map = new google.maps.Map(document.getElementById('map'), {
    zoom: 7,
    center: colorado
  })
  console.log(userPeakLog)

  userPeakLog.forEach(peak => {
    let location = {lat: parseFloat(peak.latitude), lng: parseFloat(peak.longitude)}

    let marker = new google.maps.Marker({
      position: location,
      map: map,
      title: `${peak.peak_name}`
    })

    let convertedDate = moment(peak.dateClimbed).format('MMM D, YYYY')
    let contentString = `
      <div>
        <h1 class="info-window-header">${peak.peak_name}</h1>
        <p class="info-window-text">Elevation: ${peak.elevation}</p>
        <p class="info-window-text">Rank: ${peak.rank}</p>
        <p class="info-window-text">Date climbed: ${convertedDate}</p>
        <img class="info-window-image" src="${peak.imgSrc}" alt="${peak.imgAlt}">
      </div>`

    let infowindow = new google.maps.InfoWindow({
      content: contentString,
      maxWidth: 300
    })

    marker.addListener('click', function() {
      infowindow.open(map, marker);
    });

  })
}

$(startApp)

/**
* peakData is used to save all data for each peak from the 14er API
*/
const peakData = [{
	"type": "peak",
	"id": 1,
	"attributes": {
    "imgSrc": "https://image.ibb.co/giaUg5/mt_elbert.jpg",
		"peak_name": "Mt. Elbert",
		"range": "Sawatch Range",
		"rank": "1",
		"elevation": "14433",
		"towns": "Leadville, Twin Lakes, Aspen",
		"latitude": "39.117777777777775",
		"longitude": "-106.44472222222223"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/1"
}, {
	"type": "peak",
	"id": 2,
	"attributes": {
    "imgSrc": "https://image.ibb.co/hqoMuQ/mt_massive.jpg",
		"peak_name": "Mt. Massive",
		"range": "Sawatch Range",
		"rank": "2",
		"elevation": "14421",
		"towns": "Leadville, Aspen",
		"latitude": "39.18722222222222",
		"longitude": "-106.47472222222223"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/2"
}, {
	"type": "peak",
	"id": 3,
	"attributes": {
    "imgSrc": "https://image.ibb.co/d3s9g5/mt_harvard.jpg",
		"peak_name": "Mt. Harvard",
		"range": "Sawatch Range",
		"rank": "3",
		"elevation": "14420",
		"towns": "Granite, Buena Vista, Leadville",
		"latitude": "38.92444444444444",
		"longitude": "-106.32"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/3"
}, {
	"type": "peak",
	"id": 4,
	"attributes": {
    "imgSrc": "https://image.ibb.co/d2ZcZQ/blanca.jpg",
		"peak_name": "Blanca Peak",
		"range": "Sangre de Cristo",
		"rank": "4",
		"elevation": "14345",
		"towns": "Fort Garland, Blanca, Alamosa",
		"latitude": "37.577222222222225",
		"longitude": "-105.48527777777778"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/4"
}, {
	"type": "peak",
	"id": 5,
	"attributes": {
    "imgSrc": "https://image.ibb.co/kOOh15/la_plata.jpg",
		"peak_name": "La Plata Peak",
		"range": "Sawatch Range",
		"rank": "5",
		"elevation": "14336",
		"towns": "Twin Lakes, Leadville, Buena Vista, Aspen",
		"latitude": "39.029444444444444",
		"longitude": "-106.4725"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/5"
}, {
	"type": "peak",
	"id": 6,
	"attributes": {
    "imgSrc": "https://image.ibb.co/bxQqok/uncompahgre.jpg",
		"peak_name": "Uncompahgre Peak",
		"range": "San Juan Mountains",
		"rank": "6",
		"elevation": "14309",
		"towns": "Lake City, Ouray",
		"latitude": "38.07166666666667",
		"longitude": "-107.46138888888889"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/6"
}, {
	"type": "peak",
	"id": 7,
	"attributes": {
    "imgSrc": "https://image.ibb.co/d9pcZQ/crestone_peak.jpg",
		"peak_name": "Crestone Peak",
		"range": "Sangre de Cristo",
		"rank": "7",
		"elevation": "14294",
		"towns": "Crestone, Moffat, Hooper, Alamosa",
		"latitude": "37.96666666666667",
		"longitude": "-105.58472222222221"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/7"
}, {
	"type": "peak",
	"id": 8,
	"attributes": {
    "imgSrc": "https://image.ibb.co/hniAok/mt_lincoln.jpg",
		"peak_name": "Mt. Lincoln",
		"range": "Mosquito Range",
		"rank": "8",
		"elevation": "14286",
		"towns": "Alma, Fairplay, Breckenridge",
		"latitude": "39.35138888888889",
		"longitude": "-106.11083333333333"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/8"
}, {
	"type": "peak",
	"id": 9,
	"attributes": {
    "imgSrc": "https://image.ibb.co/kBxLok/grays.jpg",
		"peak_name": "Grays Peak",
		"range": "Front Range",
		"rank": "9",
		"elevation": "14270",
		"towns": "Bakerville, Montezuma, Keystone",
		"latitude": "39.63388888888889",
		"longitude": "-105.81694444444445"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/9"
}, {
	"type": "peak",
	"id": 10,
	"attributes": {
    "imgSrc": "https://image.ibb.co/hbJh15/antero.jpg",
		"peak_name": "Mt. Antero",
		"range": "Sawatch Range",
		"rank": "10",
		"elevation": "14269",
		"towns": "Leadville, Buena Vista, Salida",
		"latitude": "38.67388888888889",
		"longitude": "-106.2461111111111"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/10"
}, {
	"type": "peak",
	"id": 11,
	"attributes": {
    "imgSrc": "https://image.ibb.co/b4MVok/torreys.jpg",
		"peak_name": "Torreys Peak",
		"range": "Front Range",
		"rank": "11",
		"elevation": "14267",
		"towns": "Bakerville, Montezuma, Keystone",
		"latitude": "39.64277777777778",
		"longitude": "-105.82083333333333"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/11"
}, {
	"type": "peak",
	"id": 12,
	"attributes": {
    "imgSrc": "https://image.ibb.co/gnzN15/castle.jpg",
		"peak_name": "Castle Peak",
		"range": "Elk Mountains",
		"rank": "12",
		"elevation": "14265",
		"towns": "Ashcroft, Crested Butte, Aspen",
		"latitude": "39.00972222222222",
		"longitude": "-106.86138888888888"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/12"
}, {
	"type": "peak",
	"id": 13,
	"attributes": {
    "imgSrc": "https://image.ibb.co/fCyzg5/quandary.jpg",
		"peak_name": "Quandary Peak",
		"range": "Tenmile Range",
		"rank": "13",
		"elevation": "14265",
		"towns": "Breckenridge, Alma, Fairplay, Leadville",
		"latitude": "39.39722222222222",
		"longitude": "-106.10583333333332"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/13"
}, {
	"type": "peak",
	"id": 14,
	"attributes": {
    "imgSrc": "https://image.ibb.co/cWE0ok/mt_evans.jpg",
		"peak_name": "Mt. Evans",
		"range": "Front Range",
		"rank": "14",
		"elevation": "14264",
		"towns": "Denver, Idaho Springs, Georgetown, Evergreen",
		"latitude": "39.58861111111111",
		"longitude": "-105.64277777777778"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/14"
}, {
	"type": "peak",
	"id": 15,
	"attributes": {
    "imgSrc": "https://image.ibb.co/buw215/longs.jpg",
		"peak_name": "Longs Peak",
		"range": "Front Range",
		"rank": "15",
		"elevation": "14255",
		"towns": "Estes Park, Meeker Park",
		"latitude": "40.25472222222222",
		"longitude": "-105.61527777777778"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/15"
}, {
	"type": "peak",
	"id": 16,
	"attributes": {
    "imgSrc": "https://image.ibb.co/mcVO8k/mt_wilson.jpg",
		"peak_name": "Mt. Wilson",
		"range": "San Juan Mountains",
		"rank": "16",
		"elevation": "14246",
		"towns": "Ouray, Telluride, Rico",
		"latitude": "37.83916666666667",
		"longitude": "-107.99083333333333"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/16"
}, {
	"type": "peak",
	"id": 17,
	"attributes": {
    "imgSrc": "https://image.ibb.co/jWzBuQ/mt_cameron.jpg",
		"peak_name": "Mt. Cameron",
		"range": "Mosquito Range",
		"rank": "N/A",
		"elevation": "14238",
		"towns": "Alma, Fairplay, Breckenridge",
		"latitude": "39.346944444444446",
		"longitude": "-106.11861111111111"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/17"
}, {
	"type": "peak",
	"id": 18,
	"attributes": {
    "imgSrc": "https://image.ibb.co/dconZQ/mt_shavano.jpg",
		"peak_name": "Mt. Shavano",
		"range": "Sawatch Range",
		"rank": "17",
		"elevation": "14229",
		"towns": "Salida, Poncha Springs, Buena Vista",
		"latitude": "38.619166666666665",
		"longitude": "-106.23944444444444"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/18"
}, {
	"type": "peak",
	"id": 19,
	"attributes": {
    "imgSrc": "https://image.ibb.co/iK90ok/mt_belford.jpg",
		"peak_name": "Mt. Belford",
		"range": "Sawatch Range",
		"rank": "18",
		"elevation": "14197",
		"towns": "Granite, Buena Vista, Leadville",
		"latitude": "38.96083333333333",
		"longitude": "-106.36055555555555"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/19"
}, {
	"type": "peak",
	"id": 20,
	"attributes": {
    "imgSrc": "https://image.ibb.co/jvGfok/crestone_needle.jpg",
		"peak_name": "Crestone Needle",
		"range": "Sangre de Cristo",
		"rank": "19",
		"elevation": "14197",
		"towns": "Crestone, Moffat, Hooper, Alamosa",
		"latitude": "37.96472222222223",
		"longitude": "-105.5761111111111"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/20"
}, {
	"type": "peak",
	"id": 21,
	"attributes": {
    "imgSrc": "https://image.ibb.co/jzWkM5/mt_princeton.jpg",
		"peak_name": "Mt. Princeton",
		"range": "Sawatch Range",
		"rank": "20",
		"elevation": "14197",
		"towns": "Buena Vista, Salida, Leadville",
		"latitude": "38.74944444444444",
		"longitude": "-106.24194444444444"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/21"
}, {
	"type": "peak",
	"id": 22,
	"attributes": {
    "imgSrc": "https://image.ibb.co/iaU5M5/mt_yale.jpg",
		"peak_name": "Mt. Yale",
		"range": "Sawatch Range",
		"rank": "21",
		"elevation": "14196",
		"towns": "Buena Vista, Leadville, Salida",
		"latitude": "38.844166666666666",
		"longitude": "-106.31333333333333"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/22"
}, {
	"type": "peak",
	"id": 23,
	"attributes": {
    "imgSrc": "https://image.ibb.co/kGjN15/mt_bross.jpg",
		"peak_name": "Mt. Bross",
		"range": "Mosquito Range",
		"rank": "22",
		"elevation": "14172",
		"towns": "Breckenridge, Alma, Leadville",
		"latitude": "39.33527777777778",
		"longitude": "-106.10694444444444"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/23"
}, {
	"type": "peak",
	"id": 24,
	"attributes": {
    "imgSrc": "https://image.ibb.co/fhF6Tk/kit_carson.jpg",
		"peak_name": "Kit Carson Peak",
		"range": "Sangre de Cristo",
		"rank": "23",
		"elevation": "14165",
		"towns": "Crestone, Moffat, Hooper, Alamosa",
		"latitude": "37.97972222222222",
		"longitude": "-105.60194444444444"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/24"
}, {
	"type": "peak",
	"id": 25,
	"attributes": {
    "imgSrc": "https://image.ibb.co/gu1fok/el_diente.jpg",
		"peak_name": "El Diente Peak",
		"range": "San Juan Mountains",
		"rank": "N/A",
		"elevation": "14159",
		"towns": "Ouray, Telluride, Rico",
		"latitude": "37.839444444444446",
		"longitude": "-108.00527777777778"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/25"
}, {
	"type": "peak",
	"id": 26,
	"attributes": {
    "imgSrc": "https://image.ibb.co/eO2Lok/maroon.jpg",
		"peak_name": "Maroon Peak",
		"range": "Elk Mountains",
		"rank": "24",
		"elevation": "14156",
		"towns": "Aspen, Snowmass",
		"latitude": "39.07083333333334",
		"longitude": "-106.98861111111111"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/26"
}, {
	"type": "peak",
	"id": 27,
	"attributes": {
    "imgSrc": "https://image.ibb.co/bK17ZQ/tabeguache.jpg",
		"peak_name": "Tabeguache Peak",
		"range": "Sawatch Range",
		"rank": "25",
		"elevation": "14155",
		"towns": "Salida, Poncha Springs, Buena Vista",
		"latitude": "38.62555555555556",
		"longitude": "-106.25055555555555"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/27"
}, {
	"type": "peak",
	"id": 28,
	"attributes": {
    "imgSrc": "https://image.ibb.co/mCEi8k/mt_oxford.jpg",
		"peak_name": "Mt. Oxford",
		"range": "Sawatch Range",
		"rank": "26",
		"elevation": "14153",
		"towns": "Granite, Buena Vista, Leadville",
		"latitude": "38.96472222222223",
		"longitude": "-106.33833333333332"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/28"
}, {
	"type": "peak",
	"id": 29,
	"attributes": {
    "imgSrc": "https://image.ibb.co/nKfqok/mt_sneffels.jpg",
		"peak_name": "Mt. Sneffels",
		"range": "San Juan Mountains",
		"rank": "27",
		"elevation": "14150",
		"towns": "Ridgway, Ouray, Telluride",
		"latitude": "38.00333333333333",
		"longitude": "-107.79166666666667"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/29"
}, {
	"type": "peak",
	"id": 30,
	"attributes": {
    "imgSrc": "https://image.ibb.co/cDit8k/mt_democrat.jpg",
		"peak_name": "Mt. Democrat",
		"range": "Mosquito Range",
		"rank": "28",
		"elevation": "14148",
		"towns": "Fairplay, Alma, Leadville",
		"latitude": "39.33972222222222",
		"longitude": "-106.13944444444445"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/30"
}, {
	"type": "peak",
	"id": 31,
	"attributes": {
    "imgSrc": "https://image.ibb.co/nLjBuQ/capitol.jpg",
		"peak_name": "Capitol Peak",
		"range": "Elk Mountains",
		"rank": "29",
		"elevation": "14130",
		"towns": "Aspen, Snowmass, Carbondale",
		"latitude": "39.150277777777774",
		"longitude": "-107.0825"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/31"
}, {
	"type": "peak",
	"id": 32,
	"attributes": {
    "imgSrc": "https://image.ibb.co/bSeSZQ/pikes.jpg",
		"peak_name": "Pikes Peak",
		"range": "Front Range",
		"rank": "30",
		"elevation": "14110",
		"towns": "Manitou Springs, Colorado Springs",
		"latitude": "38.84055555555556",
		"longitude": "-105.04388888888889"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/32"
}, {
	"type": "peak",
	"id": 33,
	"attributes": {
    "imgSrc": "https://image.ibb.co/epUuEQ/snowmass.jpg",
		"peak_name": "Snowmass Mountain",
		"range": "Elk Mountains",
		"rank": "31",
		"elevation": "14092",
		"towns": "Aspen, Snowmass, Carbondale",
		"latitude": "39.11888888888889",
		"longitude": "-107.06583333333333"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/33"
}, {
	"type": "peak",
	"id": 34,
	"attributes": {
    "imgSrc": "https://image.ibb.co/jS8h15/mt_eolus.jpg",
		"peak_name": "Mt. Eolus",
		"range": "San Juan Mountains",
		"rank": "32",
		"elevation": "14083",
		"towns": "Silverton, Ouray",
		"latitude": "37.62277777777778",
		"longitude": "-107.62083333333332"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/34"
}, {
	"type": "peak",
	"id": 35,
	"attributes": {
    "imgSrc": "https://image.ibb.co/epYX15/wisdom.jpg",
		"peak_name": "Windom Peak",
		"range": "San Juan Mountains",
		"rank": "33",
		"elevation": "14082",
		"towns": "Silverton, Ouray",
		"latitude": "37.62138888888889",
		"longitude": "-107.59138888888889"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/35"
}, {
	"type": "peak",
	"id": 36,
	"attributes": {
    "imgSrc": "https://image.ibb.co/j990ok/challenger_point.jpg",
		"peak_name": "Challenger Point",
		"range": "Sangre de Cristo",
		"rank": "34",
		"elevation": "14081",
		"towns": "Crestone, Moffat, Hooper, Alamosa",
		"latitude": "37.98027777777778",
		"longitude": "-105.6061111111111"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/36"
}, {
	"type": "peak",
	"id": 37,
	"attributes": {
    "imgSrc": "https://image.ibb.co/hDs9g5/mt_columbia.jpg",
		"peak_name": "Mt. Columbia",
		"range": "Sawatch Range",
		"rank": "35",
		"elevation": "14073",
		"towns": "Buena Vista, Leadville, Salida",
		"latitude": "38.903888888888886",
		"longitude": "-106.29694444444445"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/37"
}, {
	"type": "peak",
	"id": 38,
	"attributes": {
    "imgSrc": "https://image.ibb.co/hDZpg5/missouri.jpg",
		"peak_name": "Missouri Mountain",
		"range": "Sawatch Range",
		"rank": "36",
		"elevation": "14067",
		"towns": "Granite, Buena Vista, Leadville",
		"latitude": "38.947222222222216",
		"longitude": "-106.37777777777777"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/38"
}, {
	"type": "peak",
	"id": 39,
	"attributes": {
    "imgSrc": "https://image.ibb.co/kTwruQ/humboldt.jpg",
		"peak_name": "Humboldt Peak",
		"range": "Sangre de Cristo",
		"rank": "37",
		"elevation": "14064",
		"towns": "Silver Cliff, Westcliffe, Bradford, Crestone",
		"latitude": "37.976111111111116",
		"longitude": "-105.55472222222222"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/39"
}, {
	"type": "peak",
	"id": 40,
	"attributes": {
    "imgSrc": "https://image.ibb.co/dQwD8k/bierstadt.jpg",
		"peak_name": "Mt. Bierstadt",
		"range": "Front Range",
		"rank": "38",
		"elevation": "14060",
		"towns": "Georgetown, Idaho Springs, Grant",
		"latitude": "39.58277777777778",
		"longitude": "-105.66805555555555"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/40"
}, {
	"type": "peak",
	"id": 41,
	"attributes": {
    "imgSrc": "https://image.ibb.co/kgn9g5/conundrum.jpg",
		"peak_name": "Conundrum Peak",
		"range": "Elk Mountains",
		"rank": "N/A",
		"elevation": "14060",
		"towns": "Ashcroft, Crested Butte, Aspen",
		"latitude": "39.01444444444444",
		"longitude": "-106.86388888888888"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/41"
}, {
	"type": "peak",
	"id": 42,
	"attributes": {
    "imgSrc": "https://image.ibb.co/d5V1uQ/sunlight.jpg",
		"peak_name": "Sunlight Peak",
		"range": "San Juan Mountains",
		"rank": "39",
		"elevation": "14059",
		"towns": "Silverton, Ouray",
		"latitude": "37.62722222222222",
		"longitude": "-107.59527777777777"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/42"
}, {
	"type": "peak",
	"id": 43,
	"attributes": {
    "imgSrc": "https://image.ibb.co/kCjcZQ/handies.jpg",
		"peak_name": "Handie Peak",
		"range": "San Juan Mountains",
		"rank": "40",
		"elevation": "14048",
		"towns": "Ouray, Lake City, Silverton, Telluride",
		"latitude": "37.91305555555555",
		"longitude": "-107.5038888888889"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/43"
}, {
	"type": "peak",
	"id": 44,
	"attributes": {
    "imgSrc": "https://image.ibb.co/fyOh15/culebra.jpg",
		"peak_name": "Culebra Peak",
		"range": "Sangre de Cristo",
		"rank": "41",
		"elevation": "14047",
		"towns": "San Luis, Fort Garland, Alamosa, Trinidad",
		"latitude": "37.12222222222222",
		"longitude": "-105.185"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/44"
}, {
	"type": "peak",
	"id": 45,
	"attributes": {
    "imgSrc": "https://image.ibb.co/burPEQ/ellingwood.jpg",
		"peak_name": "Ellingwood Point",
		"range": "Sangre de Cristo",
		"rank": "42",
		"elevation": "14042",
		"towns": "Fort Garland, Blanca, Alamosa",
		"latitude": "37.5825",
		"longitude": "-105.49194444444444"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/45"
}, {
	"type": "peak",
	"id": 46,
	"attributes": {
    "imgSrc": "https://image.ibb.co/kkybTk/mt_lindsey.jpg",
		"peak_name": "Mt. Lindsey",
		"range": "Sangre de Cristo",
		"rank": "43",
		"elevation": "14042",
		"towns": "Fort Garland, Blanca, Alamosa",
		"latitude": "37.584722222222226",
		"longitude": "-105.44027777777778"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/46"
}, {
	"type": "peak",
	"id": 47,
	"attributes": {
    "imgSrc": "https://image.ibb.co/bX3X15/north_eolus.jpg",
		"peak_name": "North Eolus",
		"range": "San Juan Mountains",
		"rank": "N/A",
		"elevation": "14039",
		"towns": "Silverton, Ouray",
		"latitude": "37.625277777777775",
		"longitude": "-107.6211111111111"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/47"
}, {
	"type": "peak",
	"id": 48,
	"attributes": {
    "imgSrc": "https://image.ibb.co/f04Y8k/little_bear.jpg",
		"peak_name": "Little Bear Peak",
		"range": "Sangre de Cristo",
		"rank": "44",
		"elevation": "14037",
		"towns": "Fort Garland, Blanca, Alamosa",
		"latitude": "37.56666666666667",
		"longitude": "-105.49666666666667"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/48"
}, {
	"type": "peak",
	"id": 49,
	"attributes": {
    "imgSrc": "https://image.ibb.co/dumKg5/mt_sherman.jpg",
		"peak_name": "Mt. Sherman",
		"range": "Mosquito Range",
		"rank": "45",
		"elevation": "14036",
		"towns": "Fairplay, Alma, Leadville",
		"latitude": "39.225",
		"longitude": "-106.16916666666667"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/49"
}, {
	"type": "peak",
	"id": 50,
	"attributes": {
    "imgSrc": "https://image.ibb.co/eSDnZQ/redcloud.jpg",
		"peak_name": "Redcloud Peak",
		"range": "San Juan Mountains",
		"rank": "46",
		"elevation": "14034",
		"towns": "Ouray, Lake City, Silverton, Telluride",
		"latitude": "37.94083333333333",
		"longitude": "-107.4213888888889"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/50"
}, {
	"type": "peak",
	"id": 51,
	"attributes": {
    "imgSrc": "https://image.ibb.co/bwZuEQ/pyramid.jpg",
		"peak_name": "Pyramid Peak",
		"range": "Elk Mountains",
		"rank": "47",
		"elevation": "14018",
		"towns": "Aspen, Snowmass",
		"latitude": "39.07138888888889",
		"longitude": "-106.94972222222222"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/51"
}, {
	"type": "peak",
	"id": 52,
	"attributes": {
    "imgSrc": "https://image.ibb.co/e48X15/wilson.jpg",
		"peak_name": "Wilson Peak",
		"range": "San Juan Mountains",
		"rank": "48",
		"elevation": "14017",
		"towns": "Ouray, Telluride, Rico",
		"latitude": "37.86027777777778",
		"longitude": "-107.98416666666667"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/52"
}, {
	"type": "peak",
	"id": 53,
	"attributes": {
    "imgSrc": "https://image.ibb.co/jSSguQ/wetterhorn.jpg",
		"peak_name": "Wetterhorn Peak",
		"range": "San Juan Mountains",
		"rank": "49",
		"elevation": "14015",
		"towns": "Lake City, Ouray",
		"latitude": "38.06055555555555",
		"longitude": "-107.51027777777777"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/53"
}, {
	"type": "peak",
	"id": 54,
	"attributes": {
    "imgSrc": "https://image.ibb.co/by6Vok/san_luis.jpg",
		"peak_name": "San Luis Peak",
		"range": "San Juan Mountains",
		"rank": "50",
		"elevation": "14014",
		"towns": "Creede, Lake City, Gunnison",
		"latitude": "37.98694444444445",
		"longitude": "-106.93083333333334"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/54"
}, {
	"type": "peak",
	"id": 55,
	"attributes": {
    "imgSrc": "https://image.ibb.co/hhFeg5/north_maroon.jpg",
		"peak_name": "North Maroon Peak",
		"range": "Elk Mountains",
		"rank": "N/A",
		"elevation": "14014",
		"towns": "Aspen, Snowmass",
		"latitude": "39.07611111111112",
		"longitude": "-106.98722222222223"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/55"
}, {
	"type": "peak",
	"id": 56,
	"attributes": {
    "imgSrc": "https://image.ibb.co/c7dbTk/mt_of_the_holy_cross.jpg",
		"peak_name": "Mt. of the Holy Cross",
		"range": "Sawatch Mountains",
		"rank": "51",
		"elevation": "14005",
		"towns": "Red Cliff, Minturn, Vail",
		"latitude": "39.46805555555556",
		"longitude": "-106.47916666666667"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/56"
}, {
	"type": "peak",
	"id": 57,
	"attributes": {
    "imgSrc": "https://image.ibb.co/giCWuQ/huron.jpg",
		"peak_name": "Huron Peak",
		"range": "Sawatch Mountains",
		"rank": "52",
		"elevation": "14003",
		"towns": "Granite, Buena Vista, Leadville",
		"latitude": "38.945277777777775",
		"longitude": "-106.4375"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/57"
}, {
	"type": "peak",
	"id": 58,
	"attributes": {
    "imgSrc": "https://image.ibb.co/ipS38k/sunshine.jpg",
		"peak_name": "Sunshine Peak",
		"range": "San Juan Mountains",
		"rank": "53",
		"elevation": "14001",
		"towns": "Ouray, Lake City, Silverton, Telluride",
		"latitude": "37.922777777777775",
		"longitude": "-107.42500000000001"
	},
	"links": "colorado-14ers-api.herokuapp.com/api/v1/peaks/58"
}];
