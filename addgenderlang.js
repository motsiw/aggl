// Add German Gender Language
// v0.2
// License: GPL v3.3



// Einstellungen laden
browser.storage.local.get(function(settings) {

	if (spracheWebsite())
	{
		console.log("AGGL - Deutschsprachige Webseite erkannt.");
		if (settings.aktiv) removeGender(settings.aktiv);
	}
	else
	{
		console.log("AGGL - Webseite nicht als deutschsprachig erkannt.");
		browser.runtime.sendMessage({
			count: '-',
			type: "count"
		});
	}
});


// ermitteln, ob Webseite auf Deutsch ist
function spracheWebsite() {
  	var rueckgabe=0;
	var docxmllang = document.getElementsByTagName('html')[0].getAttribute('xml:lang');
	var doclang = document.getElementsByTagName('html')[0].getAttribute('lang');
	doclang = String(doclang).toLowerCase()+String(docxmllang).toLowerCase();
	var metalang = document.querySelectorAll('meta[content="de"]');
	var metalang1 = document.querySelectorAll('meta[content="DE"]');
	var metalang2 = document.querySelectorAll('meta[content="de-de"]');
	var metalang3 = document.querySelectorAll('meta[content="de-at"]');
	var metalang4 = document.querySelectorAll('meta[content="de-DE"]');
	var metalang5 = document.querySelectorAll('meta[content="de-AT"]');
	var metalang6 = document.querySelectorAll('meta[content="de-CH"]');
	var metalang7 = document.querySelectorAll('meta[content="de-ch"]');
	if (doclang.indexOf("de") != -1 || doclang.indexOf("at") != -1  || doclang.indexOf("ch") != -1 || metalang.length > 0 || metalang1.length > 0 || metalang2.length > 0 || metalang3.length > 0 || metalang4.length > 0 || metalang5.length > 0 || metalang6.length > 0 || metalang7.length > 0)
	{
		rueckgabe = 1;
	}
	return rueckgabe;
}

function removeGender(sollrot) {

	// Zeitnahme der Abarbeitung starten
	console.time('AGGL');
	
	var result = [];
	var checkme = '';
	var n;

	var walk = document.createTreeWalker(
			document.body,
			NodeFilter.SHOW_TEXT, {
				acceptNode: function(node) {
							return NodeFilter.FILTER_ACCEPT;
				}
			},
			false);
	while (n = walk.nextNode()) 
	{ 
		checkme = n.parentElement.tagName.toLowerCase();
		if (checkme == 'span' || checkme == 'p' || checkme == 'li' || checkme == 'b' || checkme == 'em' || checkme == 'a' || checkme == 'h1' || checkme == 'h2' || checkme == 'h3' || checkme == 'h4' || checkme == 'h5' || checkme == 'h6' || checkme == 'figcaption' || checkme == 'td' || checkme == 'blockquote' || checkme == 'mark') 
		{
			if (sollrot == 2) result.push(n.parentElement);
			else result.push(n); 
		}
	};


	console.log("AGGL - prüfe "+result.length+" Seitenelemente");
	var i;
	var str;
	var rot1="";
	var rot2="";
	var rot3="";
	var oldstr="";
	var changes=0;
	var x=0;
	var oldohnehrefclassstyle="";
	var strohnehrefclassstyle="";

	 
	 if (sollrot == 2) {
		rot1="<span style='color:blue;background-color: yellow;'>";
		rot2="</span>";
		rot3="_";
	 } 
	
	for (i = 0; i < result.length; i++) {
	  if (sollrot == 2) str = result[i].innerHTML;
	  else str = result[i].data;
	  
	  // Sonderbehandlung taz: Weiche Trennstriche entfernen
	  str = str.replace(/­/g,"");
	  str = str.replace(/[\u202F\u00A0]/," ");
	  // Sonderbehandlung taz / PS-Fonts: Vokale plus Trema zu richtigen Umlauten machen
	  str = str.replace(/u\u0308/g,"ü");
	  str = str.replace(/U\u0308/g,"Ü");
	  str = str.replace(/o\o0308/g,"ö");
	  str = str.replace(/O\O0308/g,"Ö");
	  str = str.replace(/ä\a0308/g,"ä");
	  str = str.replace(/Ä\A0308/g,"Ä");
	  str = str.replace(/Ä\A0308/g,"Ä");
	  

	  oldstr = str;

	  // man
	  str = str.replace(/ man([,).“\?"!\--] | |$)/g," "+rot1+"man:frau"+rot2+"$1");
	  str = str.replace(/ Man([,).“\?"!\--] | |$)/g," "+rot1+"Man:frau"+rot2+"$1");
	  
	  
	  // Nominativ/Akkusativ plural bei Nomen auf r
	  str = str.replace(/(Liebe|An|Durch|Bis|Für|Gegen|Ohne|Um|Alle|Rund|Knapp| liebe| an| durch| bis| für| gegen| ohne| um| alle| rund| knapp)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄ][a-züöäß]*?)(usiker|ritiker|ropäer|ndianer|merikaner|andwerker|portler|ünstler|orscher|orgänger|achfolger|egner|nhänger|esucher|nwender|chüler|rbeiter|ehrer|nhänger|rbeitnehmer|rbeitgeber|chmuggler|ichter|ertreter|ienstleister|pieler|issenschaftler|aucher|wohner|eobachter|utzer|olitiker|ürger|inister|verdiener|usländer|eiter|rüfer)([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");

	  // Nominativ/Akkusativ plural bei Nomen auf t
	  str = str.replace(/(Liebe|An|Durch|Bis|Für|Gegen|Ohne|Um|Alle|Rund|Knapp| liebe| an| durch| bis| für| gegen| ohne| um| alle| rund| knapp)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄa-züöäß])(ourist|siat|andrät|olizist|tudent|issident|andidat|äsident|oldat|xpert|atient)en([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");

	  // Nominativ/Akkusativ plural bei Nomen auf fs
	  str = str.replace(/(Liebe|An|Durch|Bis|Für|Gegen|Ohne|Um|Alle|Rund|Knapp| liebe| an| durch| bis| für| gegen| ohne| um| alle| rund| knapp)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄa-züöäß])(hef)s([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");

	  // Dativ  plural bei Nomen auf r
	  str = str.replace(/(Von|Mit|Auf|Unter|Über|Vor|Zu|Aus|Bei|Außer|Nach|Samt|Seit|Meinen|Seinen|Laut|An| von| mit| auf| unter| über| vor| zu| aus| bei| außer| nach| samt| seit| meinen| seinen| unseren| ihren| laut| verschiedenen| vielen| an)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄ][a-züöäß]*?)(usiker|ritiker|ropäer|ndianer|merikaner|andwerker|portler|ünstler|orscher|orgänger|achfolger|egner|nhänger|esucher|nwender|chüler|rbeiter|ehrer|nhänger|rbeitnehmer|rbeitgeber|chmuggler|ichter|ertreter|ienstleister|pieler|issenschaftler|aucher|wohner|eobachter|utzer|olitiker|ürger|inister|verdiener|usländer|eiter)n([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");

	  // Dativ  plural bei Nomen auf t
	  str = str.replace(/(Von|Mit|Auf|Unter|Über|Vor|Zu|Aus|Bei|Außer|Nach|Samt|Seit|Meinen|Seinen|Laut|An| von| mit| auf| unter| über| vor| zu| aus| bei| außer| nach| samt| seit| meinen| seinen| unseren| ihren| laut| verschiedenen| vielen| an)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄ][a-züöäß]*?)(ourist|siat|andrät|olizist|tudent|issident|andidat|äsident|oldat|xpert|atient)en([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");

	  // Dativ  plural bei Nomen auf fs
	  str = str.replace(/(Von|Mit|Auf|Unter|Über|Vor|Zu|Aus|Bei|Außer|Nach|Samt|Seit|Meinen|Seinen|Laut|An| von| mit| auf| unter| über| vor| zu| aus| bei| außer| nach| samt| seit| meinen| seinen| unseren| ihren| laut| verschiedenen| vielen| an)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄ][a-züöäß]*?)(hef)s([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");

	  // Dativ  plural bei Nomen auf ren
	  str = str.replace(/(Von|Mit|Auf|Unter|Über|Vor|Zu|Aus|Bei|Außer|Nach|Samt|Seit|Meinen|Seinen|Laut|An| von| mit| auf| unter| über| vor| zu| aus| bei| außer| nach| samt| seit| meinen| seinen| unseren| ihren| laut| verschiedenen| vielen| an)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄ][a-züöäß]*?)(rofessor|utor|rganisator|nvestor|ktionär|ovator|oderator|enior)en([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");
	  
	  // Fall egal plural bei Nomen auf ren und Unbestimmtheit
	  str = str.replace(/(Viele|Alle|Einige|Ihre|Unsere|Für|Seine|Mehrere| mehrere| seine| unsere| für| ihre| viele| alle| einige|kanische|kanischen)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄa-züöä])(rofessor|utor|rganisator|nvestor|ktionär|ovator|oderator|enior)en([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");

	  // Genitiv plural bei Nomen auf r und Unbestimmtheit
	  str = str.replace(/(Dieser|Vieler|Aller|Einiger|Ihrer| ihrer| dieser| vieler| aller| einiger|kanischer)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄ][a-züöäß]*?)(usiker|ritiker|ropäer|ndianer|merikaner|andwerker|portler|ünstler|orscher|orgänger|achfolger|egner|nhänger|esucher|nwender|chüler|rbeiter|ehrer|nhänger|rbeitnehmer|rbeitgeber|chmuggler|ichter|ertreter|ienstleister|pieler|issenschaftler|aucher|wohner|obachter|utzer|olitiker|ürger|inister|verdiener|usländer|eiter|rüfer)([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");

	  // Genitiv plural bei Nomen auf t und Unbestimmtheit
	  str = str.replace(/(Dieser|Vieler|Aller|Einiger|Ihrer| ihrer| dieser| vieler| aller| einiger|ischer)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄa-züöä])(ourist|siat|andrät|olizist|tudent|issident|andidat|äsident|oldat|xpert|atient)en([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");

	  // Genitiv plural bei Nomen auf fs und Unbestimmtheit
	  str = str.replace(/(Dieser|Vieler|Aller|Einiger|Ihrer| ihrer| dieser| vieler| aller| einiger|ischer)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄa-züöä])(hef)s([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");
	  
	  // Fall egal plural bei Nomen auf r und Unbestimmtheit
	  str = str.replace(/(Viele|Alle|Einige|Ihre|Unsere|Für|Seine|Mehrere| mehrere| seine| unsere| für| ihre| viele| alle| einige|kanische|kanischen)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄ][a-züöäß]*?)(usiker|ritiker|ropäer|ndianer|merikaner|andwerker|portler|ünstler|orscher|orgänger|achfolger|egner|nhänger|esucher|nwender|chüler|rbeiter|ehrer|nhänger|rbeitnehmer|rbeitgeber|chmuggler|ichter|ertreter|ienstleister|pieler|issenschaftler|aucher|wohner|obachter|utzer|olitiker|ürger|inister|verdiener|usländer|eiter)([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");

	  // Fall egal plural bei Nomen auf t und Unbestimmtheit
	  str = str.replace(/(Viele|Alle|Einige|Ihre|Unsere|Für|Seine|Mehrere| mehrere| seine| unsere| für| ihre| viele| alle| einige|kanische|kanischen)(| [0-9,.]*?| [0-9,.]*? Millionen| [0-9,.]*? Mio\.| zwei| drei| vier| fünf| sechs| sieben| acht| neun| zehn| elf| zwölf| zwanzig| dreißig| vierzig| fünfzig| hundert| tausend) ([A-ZÜÖÄ])(siat|andrät|olizist|tudent|issident|andidat|äsident|oldat|xpert|atient)en([ ,).“\?"!\--])([^u]|$)/g,"$1$2 "+rot1+"$3$4:innen"+rot2+"$5$6");

	  // Nominativ singular bei Nomen auf r und Unbestimmtheit "jeder"
	  str = str.replace(/(J|j)eder ([A-ZÜÖÄ][a-züöäß]*?)(usiker|ritiker|ropäer|ndianer|merikaner|andwerker|portler|ünstler|orscher|orgänger|achfolger|egner|nhänger|esucher|nwender|chüler|rbeiter|ehrer|nhänger|rbeitnehmer|rbeitgeber|chmuggler|ichter|ertreter|ienstleister|pieler|issenschaftler|aucher|wohner|eobachter|utzer|ürger|olitiker|inister|verdiener|rofessor|utor|rganisator|nvestor|ktionär|ovator|oderator|usländer|eiter|rüfer)([ ,).“\?"!\--])([^u]|$)/g,""+rot1+"$1ede:r $2$3:in$4"+rot2+"$5");

	  // Nominativ singular bei Nomen auf r und Unbestimmtheit "ein"
	  str = str.replace(/(Ein| ein) ([A-ZÜÖÄ][a-züöäß]*?)(usiker|ritiker|ropäer|ndianer|merikaner|andwerker|portler|ünstler|orscher|orgänger|achfolger|egner|nhänger|esucher|nwender|chüler|rbeiter|ehrer|nhänger|rbeitnehmer|rbeitgeber|chmuggler|ichter|ertreter|ienstleister|pieler|issenschaftler|aucher|wohner|eobachter|utzer|ürger|olitiker|inister|verdiener|rofessor|utor|rganisator|nvestor|ktionär|ovator|oderator|usländer|eiter|rüfer)([ ,).“\?"!\--])([^u]|$)/g,""+rot1+"$1:e $2$3:in$4"+rot2+"$5");

	  // Nominativ singular bei Nomen auf r und Unbestimmtheit "mancher"
	  str = str.replace(/(M|m)ancher ([A-ZÜÖÄ][a-züöäß]*?)(usiker|ritiker|ropäer|ndianer|merikaner|andwerker|portler|ünstler|orscher|orgänger|achfolger|egner|nhänger|esucher|nwender|chüler|rbeiter|ehrer|nhänger|rbeitnehmer|rbeitgeber|chmuggler|ichter|ertreter|ienstleister|pieler|issenschaftler|aucher|wohner|eobachter|utzer|ürger|olitiker|inister|verdiener|rofessor|utor|rganisator|nvestor|ktionär|ovator|oderator|usländer|eiter|rüfer)([ ,).“\?"!\--])([^u]|$)/g,""+rot1+"$1anche:r $2$3:in$4"+rot2+"$5");


	  // Jeder, mancher, keiner wenn kein Leerzeichen, sondern ein Satzzeichen folgt (sonst würde in keiner Weise, in mancher Hinsicht etc. auch gegendert)
	  str = str.replace(/(j|J)eder([,).:“\?"!-])/g,rot1+"$1ede:r"+rot2+"$2"); 
	  str = str.replace(/(m|M)ancher([,).:“\?"!-])/g,rot1+"$1anche:r"+rot2+"$2"); 
	  str = str.replace(/(k|K)einer([,).:“\?"!-])/g,rot1+"$1eine:r"+rot2+"$2"); 
	  




	  // prüfen, ob Änderungen innerhalb von href, class oder style-Attributen stattfanden. Wenn ja, wird auf die Korrektur vorsorglich verzichtet
	  oldohnehrefclassstyle = oldstr.replace(/(href|style|class|src|itemprop|onclick|onmouseover|xmlns|alt)=("|').*?("|')/g,"$1=$2$3");
	  strohnehrefclassstyle = str.replace(/(href|style|class|src|itemprop|onclick|onmouseover|xmlns|alt)=("|').*?("|')/g,"$1=$2$3");

	  // liefert den ersten Unterschied zwischen zwei Strings
	  function ersterUnterschied(stringa, stringb)
	  {
		var i = 0, fundstelle = 0;

		while (i < stringb.length)
		{
		  if (stringa[i] != stringb[i] || i == stringa.length) {
			 fundstelle = i;
			 break; 
		  } else i++;
		}
		return fundstelle;
	  }
	  
	  
	  if (oldohnehrefclassstyle != strohnehrefclassstyle) 
		{
			changes++;
			x=ersterUnterschied(oldohnehrefclassstyle, strohnehrefclassstyle);
			if (x < 50) x = 50;
			x-=50;
			if (oldohnehrefclassstyle.length < 100) console.log("%cAGGL #"+changes+" Tag "+result[i].nodeName+" - old: ..."+oldohnehrefclassstyle.substr(x)+"...", 'color: red;');
			else console.log("%cAGGL Change #"+changes+" Tag "+result[i].nodeName+" - old: ..."+oldohnehrefclassstyle.substr(x,100)+"...", 'color: red;');
			if (strohnehrefclassstyle.length < 100) console.log("%cAGGL Change #"+changes+" Tag "+result[i].nodeName+" - new: ..."+strohnehrefclassstyle.substr(x)+"...", 'color: green;');
			else console.log("%cAGGL Change #"+changes+" Tag "+result[i].nodeName+" - new: ..."+strohnehrefclassstyle.substr(x,100)+"...", 'color: green;');
			
			if (sollrot == 2) result[i].innerHTML = str;
			else result[i].data = str;
		}
	  }
	  
	  // background-Skript über die Zahl der Ersetzungen informieren
	    browser.runtime.sendMessage({
            count: changes,
            type: "count"
        });
	  
	  // Zeit der Abarbeitung stoppen und Ergebnis in die Konsole schreiben
	  console.timeEnd('AGGL');
}


