$(function() {
	$('.input-group.date').datepicker({
	    autoclose: true,
	    todayHighlight: true
	});
});

$(function () { 
	$("#form-multi-cut").validator();
});

$(function() {
    var form = $("#form-multi-cut"),
        wrapper = $("#cuts-container"),
        cuts = $("#cuts");
    
    $(cuts).keyup(function(e){ //on add input change
        e.preventDefault();
        $(wrapper).empty();
        for (var i = 0; i < cuts.val(); i++) {
            $(wrapper).append('<div class="form-group col-xs-6"><label for="cutTitle">Cut '+(i+1)+' Title</label><input type="text" class="form-control" id="cutTitle'+i+'" name="cutTitle[]" placeholder="What is title of this cut?" data-minlength="2" required><div class="help-block with-errors"></div></div><div class="form-group col-xs-6"><label for="cutFilepath">Cut '+(i+1)+' Filepath</label><input type="text" class="form-control" id="cutFilepath'+i+'" name="cutFilepath[]" placeholder="What is the filepath of this cut?" data-minlength="2" required><div class="help-block with-errors"></div></div>'); //add cut
        }
    });
    
    
    $(form).submit(function(e) {
        e.preventDefault();
        
		if ($("#artist").val() && cuts.val() > 0) {
			var xw = new XMLWriter('UTF-8');
	        xw.formatting = 'indented';//add indentation and newlines
	        xw.indentChar = ' ';//indent with spaces
	        xw.indentation = 4;//add 4 spaces per level
	
			var DVDisChecked = $('#type_dvd').is(':checked');
			var BluRayisChecked = $('#type_bluray').is(':checked');

	        xw.writeStartDocument();
	        xw.writeStartElement('contentagent');
	            xw.writeStartElement('contentagentjob');
	                xw.writeStartElement('sequence_filesources');
	
					if (DVDisChecked) xw.writeAttributeString('title', 'Reel for DVD');
					if (BluRayisChecked) xw.writeAttributeString('title', 'Reel for Blu-ray');

	                for (var i = 0; i < cuts.val(); i++) {
	                    xw.writeStartElement('filesource');
	                        xw.writeAttributeString('title', $('#cutTitle'+i).val());
	                        xw.writeAttributeString('filepath', $('#cutFilepath'+i).val());

	                        xw.writeStartElement('clipmetadata');

	                            xw.writeStartElement('metadatacollection');

	                                xw.writeStartElement('metadata');
	                                    xw.writeAttributeString('groupname', 'Rimage');
	                                    xw.writeAttributeString('copyinc', 'true');

	                                    xw.writeStartElement('data');
	                                        xw.writeAttributeString('name', 'artist');
	                                        xw.writeAttributeString('displayname', 'Artist');
	                                        xw.writeAttributeString('type', 'TextField');
	                                        xw.writeAttributeString('value', $("#artist").val());
	                                    xw.writeEndElement();

	                                    xw.writeStartElement('data');
	                                        xw.writeAttributeString('name', 'city');
	                                        xw.writeAttributeString('displayname', 'City');
	                                        xw.writeAttributeString('type', 'TextField');
	                                        xw.writeAttributeString('value', $("#city").val());
	                                    xw.writeEndElement();

	                                    xw.writeStartElement('data');
	                                        xw.writeAttributeString('name', 'order');
	                                        xw.writeAttributeString('displayname', 'Order');
	                                        xw.writeAttributeString('type', 'TextField');
	                                        xw.writeAttributeString('value', $("#order").val());
	                                    xw.writeEndElement();

	                                    xw.writeStartElement('data');
	                                        xw.writeAttributeString('name', 'date');
	                                        xw.writeAttributeString('displayname', 'Date');
	                                        xw.writeAttributeString('type', 'TextField');
	                                        xw.writeAttributeString('value', $("#date").val());
	                                    xw.writeEndElement();

	                                xw.writeEndElement();
	                            xw.writeEndElement();
	                        xw.writeEndElement();
	                    xw.writeEndElement();
	                }
	                xw.writeEndElement();

	                xw.writeStartElement('storeworkflow');
						if (DVDisChecked) xw.writeAttributeString('workflowname', 'BluRayMultiClip');
						if (BluRayisChecked) xw.writeAttributeString('workflowname', 'DVDNOLABEL_Final');
	
	                    xw.writeAttributeString('workflowid', '');
	                    xw.writeAttributeString('useraccount', 'User');
	                xw.writeEndElement();

	            xw.writeEndElement();
	        xw.writeEndElement();
	        xw.writeEndDocument();

	        var xml = xw.flush(); //generate the xml string
	        xw.close();//clean the writer
	        xw = undefined;//don't let visitors use it, it's closed

	        //set the xml
	        //document.getElementById('parsed-xml').value = xml;

	        // Force XML download
	        var blob = new Blob([xml], {type: "text/xml;charset=utf-8"});
	        var filename =  $('#order').val() + ".xml";
	        saveAs(blob, filename);
		}
    });
});