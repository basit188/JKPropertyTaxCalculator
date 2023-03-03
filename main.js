coroporation_list = ['Srinagar','Jammu']
council_list = ['Anantnag', 'Kulgam', 'Pulwama', 'Ganderbal', 'Budgam', 'Baramulla', 'Sopore', 'Bandipora', 'Kupwara','Samba', 'Kathua', 'Rajouri','Kishtwar', 'Udhampur', 'Poonch', 'Reasi', 'Doda', 'Ramban']
committee_list = ['Akhnoor','Gho-Manhasan', 'Bishnah','Arnia','R.S.Pura', 'Khour', 'Jourian', 'Vijaypur', 'Bari-Brahamana', 'Ramgarh', 'Hiranagar', 'Basholi', 'Lakhanpur', 'Billawar', 'Parole',  'Sunderbani ', 'Kalakote', 'Nowshera', 'Thanamandi', 'Chenani', 'Ramnagar', 'Katra-Purana Duroor',  'Thathri', 'Bhaderwah', 'Batote', 'Banihal',  'Surankote', 'Achabal', 'Bijbehara', 'Kokernag', 'Mattan', 'Qazigund', 'Aishmuquam', 'Seer Hamdan', 'Dooru-Veerinag', 'Devsar', 'Yaripora', 'Frisal', 'Pampore', 'Tral', 'Khrew', 'Awantipora', 'Shopian', 'Khansahib', 'Magam', 'Beerwah', 'Chadoora', 'Charie Sharief', 'Kunzer', 'Pattan', 'Uri', 'Watergam',  'Sumbal', 'Hajin', 'Handwara','Langate']
factors = {}
tav = 1




distict_municipalities = {
	'Srinagar': ['Srinagar'],
	'Jammu': ['Jammu','Akhnoor', 'Gho-Manhasan', 'Bishnah', 'Arnia', 'R.S.Pura', 'Khour'],
	'Samba': ['Jourian', 'Samba', 'Vijaypur', 'Bari-Brahamana', 'Ramgarh'],
	'Kathua': ['Hiranagar', 'Kathua', 'Basholi', 'Lakhanpur', 'Billawar', 'Parole'],
	'Rajouri': ['Rajouri', 'Sunderbani ', 'Kalakote', 'Nowshera', 'Thanamandi'],     
	'Kishtwar': ['Kishtwar'],
	'Udhampur': ['Udhampur', 'Chenani', 'Ramnagar'],
	'Reasi': ['Katra / Purana Duroor', 'Reasi'],
	'Doda': ['Doda', 'Thathri', 'Bhaderwah'],
	'Ramban': ['Ramban', 'Batote', 'Banihal'],
	'Poonch': ['Poonch', 'Surankote'],
	'Anantnag': ['Anantnag', 'Achabal', 'Bijbehara', 'Kokernag', 'Mattan', 'Qazigund', 'Aishmuquam', 'Seer Hamdan', 'Dooru – Veerinag'],
	'Kulgam': ['Kulgam', 'Devsar', 'Yaripora', 'Frisal'],
	'Pulwama': ['Pulwama', 'Pampore', 'Tral', 'Khrew', 'Awantipora'],
	'Shopian': ['Shopian'],
	'Ganderbal': ['Ganderbal'],
	'Budgam': ['Budgam', 'Khansahib', 'Magam', 'Beerwah', 'Chadoora', 'Charie Sharief'],
	'Baramulla': ['Baramulla', 'Sopore', 'Kunzer', 'Pattan', 'Uri', 'Watergam'],
	'Bandipora': ['Bandipora', 'Sumbal', 'Hajin'],
	'Kupwara': ['Kupwara', 'Handwara', 'Langate']
}

function get_municipality_type(m){
	if(coroporation_list.includes(m))
		return "coroporation"
	else if(council_list.includes(m))
		return "council"
	else
		return "committee"
}

$('#municipality').change(function(e){
	municipality_type = $('#municipality').val()
	factors['mtf'] = (municipality_type == "coroporation")? 1 : (municipality_type == "council")?0.75:0.5

	get_tav()
})

function update_land_area(){
	land_rate = $("#land_rate").val()
	factors['lvf'] = (land_rate)/10
	$("#total_land_area_in_kanals").html(get_land_in_kanals())
	$("#total_land_area_in_sft").html(get_land_in_sft())
	$("#total_land_cost").html(get_land_in_kanals()*land_rate)

	if(get_land_in_kanals()>0){
		$("#land_in_sft").html(get_land_in_sft().toFixed(3))
		$("#land_in_kanal").html(get_land_in_kanals().toFixed(3))
		$("#land_alert").show()
	}else{
		$("#land_alert").hide()
	}

	$("#builtup_sft").trigger("change")

	get_tav()
	//
}

function get_land_in_sft(){
	kanal = Number($('#land_kanal').val())
	marla = Number($('#land_marla').val())
	sirsai = Number($('#land_sirsai').val())
	sft = Number($('#land_sft').val())
	total_sft = sft + (30.25*sirsai) + (272.25*marla) + (272.25*20*kanal)
	return total_sft
}

function get_land_in_kanals(){
	return get_land_in_sft()/5445.0
}

$('#land_kanal').change(update_land_area)
$('#land_marla').change(update_land_area)
$('#land_sirsai').change(update_land_area)
$('#land_sft').change(update_land_area)
$('#land_rate').change(update_land_area)

$('#builtup_sft').change(function(){
	builtup_sft = Number($('#builtup_sft').val())
	land_in_sft = get_land_in_sft()
	factors['arf'] = builtup_sft
	factors['sf'] = get_slab_factor(builtup_sft)
	if(land_in_sft>(3*builtup_sft)){
		factors['arf'] = builtup_sft + (land_in_sft-(3*builtup_sft))
	}

	get_tav()
})


function get_slab_factor(builtup_area){
	if($('#opt_residential').is(":checked")){

		if(builtup_area<1000)
			return 0
		else if (builtup_area<1500)
			return 0.75
		else if (builtup_area<2000)
			return 1
		else if (builtup_area<2500)
			return 1.15
		else if (builtup_area<5000)
			return 1.30
		else
			return 1.50
	}else{
		if(builtup_area<100)
			return 0.50
		else if(builtup_area<250)
			return 0.75
		else if(builtup_area<500)
			return 1
		else if(builtup_area<1000)
			return 1.15
		else if(builtup_area<2500)
			return 1.3
		else if(builtup_area<5000)
			return 1.5
		else
			return 2.0
	}
}

function get_floor_factor(){
	floor_factors = [1,0.8,0.7,0.5]
	basement_factor = $('#has_basement').is(":checked")?0.5:0
	num_floors = Number($('#num_floors').val())
	if(num_floors==5){
		floor_factor = 0.1
		basement_factor=0
	}else{
		if($('#opt_residential').is(":checked")){
			floor_factor = 1
		}else{
			ff_sum = floor_factors.slice(0,num_floors)
			floor_factor = ff_sum.reduce((t,a) => t+a,0)
			console.log("floro factor: "+floor_factor)
		}

	}
	ff = basement_factor + floor_factor
	factors['ff'] = ff
	get_tav()
	return ff
}


$("#district").change(function (e) {
	district = $('#district').val()
	municipalities = distict_municipalities[district]
	option_values = municipalities.map(x => `<option value='${get_municipality_type(x)}'>${x}</option>`)
	$('#municipality').html(option_values)
	$('#municipality').trigger("change")
	get_tav()
})








$('input[type=radio][name=residency_type]').change(function() {

	residential_usage = `<option value="2">Residential Appartment/ Flat</option>
	<option value="2.5">Residential House</option>`

	non_residential_usage = `<option value="5">Industrial (Manufacturing)</option>
	<option value="7">Institutional/ Public/ Semi Public</option>
	<option value="12">Commercial, except 3 star and above Hotels: Towers and Hoardings</option>
	<option value="15">3 Star and above Hotels, Towers and Hoardings</option>`


	if(this.value==1){
		$('#structure_usage').html(non_residential_usage)
	}else if(this.value==0){
		$('#structure_usage').html(residential_usage)
	}else{
		$('#structure_usage').html(residential_usage)
	}

	$('#structure_usage').trigger("change")
	get_floor_factor()
	get_tav()

 })

$('#structure_usage').change(function(){
	factors['utf'] = Number(this.value)
	//

	get_tav()

})

$('#construction_type').change(function(){
	factors['ctf'] = Number(this.value)
	get_tav()
	//

})

$('#structure_age').change(function(){
	factors['agf'] = Number(this.value)
	get_tav()

})

$('#occupancy_status').change(function(){
	factors['osf'] = Number(this.value)
	get_tav()

})

$('#num_floors').change(get_floor_factor)
$('#has_basement').change(get_floor_factor)

$(function(){
	$('#district').trigger("change")
	$('#structure_age').trigger("change")
	$('#occupancy_status').trigger("change")
	$('#num_floors').trigger("change")
	$('#occupancy_status').trigger("change")
	$('#construction_type').trigger("change")
	$('#structure_usage').trigger("change")


	const tooltipTriggerList = document.querySelectorAll('[data-bs-toggle="tooltip"]')
	const tooltipList = [...tooltipTriggerList].map(tooltipTriggerEl => new bootstrap.Tooltip(tooltipTriggerEl))


	$('#builtup_sft').trigger("change")
	$('#land_rate').trigger("change")
	// $('input[type=radio][name=residency_type]').trigger("change")
	$('#opt_residential').trigger("change")

})


function num_validation(event){

	return (event.charCode !=8 && event.charCode ==0 || (event.charCode >= 48 && event.charCode <= 57))
}

function get_tav(){

	if (Object.keys(factors).length==9){
		keys = Object.keys(factors)
		tav = 1
		tav_str = ""
		for (f of keys){
			tav = tav * factors[f]
			$(`#${f}`).html(factors[f].toFixed(2))
			tav_str = tav_str + `${factors[f]} (${f}) x `
		}

		tav_str = tav_str + " = " + String(tav)
		$("#tav").html(tav.toFixed(2))

		tax_percentage = ($('#opt_residential').is(":checked"))?5:6;
		$("#tax_rate").html(tax_percentage)
		total_tax = tav*(tax_percentage/100.00)
		$("#total_tax").html(total_tax.toFixed(2))

	}
	


}