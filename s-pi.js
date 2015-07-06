window.addEventListener("load", loadData);
window.addEventListener("hashchange", loadData);

function loadData() {
  id = window.location.hash.substring(1);
  loadPatient(id);
}

function loadPatient(id) {
  $.getJSON('/patients.json', function(data) {
    patient_data = data['patients'][id];
    $( ".name-text").html(patient_data["name"]);
    $( "#age").html(patient_data["age"]);
    $( "#bed").html(patient_data["bed"]);
    $( "#status").html(patient_data["status"]);
    $( "div#dataModal .modal-body" ).html(patient_data['clinical-data']['html']);
    $( "div#labsModal .modal-body" ).html(patient_data['labs-data']['html']);
    $( "div#medsModal .modal-body" ).html(patient_data['meds-data']['html']);
    $( "div#progressModal .modal-body" ).html(patient_data['progress-data']['html']);
  
  } );
}
