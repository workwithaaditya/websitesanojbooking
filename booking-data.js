/* ===================================================
   SANOJ PROPERTIES – Booking Data & Smart Search
   Stations, Trains, Flights, Airports
   =================================================== */

const BOOKING_DATA = (() => {

  // ─── POPULAR RAILWAY STATIONS ──────────────────
  const stations = [
    "New Delhi (NDLS)", "Old Delhi (DLI)", "Mumbai Central (MMCT)", "Mumbai CST (CSMT)",
    "Chennai Central (MAS)", "Kolkata Howrah (HWH)", "Kolkata Sealdah (SDAH)",
    "Bangalore City (SBC)", "Hyderabad Deccan (HYB)", "Secunderabad (SC)",
    "Ahmedabad (ADI)", "Pune (PUNE)", "Jaipur (JP)", "Lucknow (LKO)",
    "Lucknow Charbagh (LJN)", "Kanpur Central (CNB)", "Patna (PNBE)",
    "Varanasi (BSB)", "Allahabad Prayagraj (PRYJ)", "Bhopal (BPL)",
    "Indore (INDB)", "Nagpur (NGP)", "Amritsar (ASR)", "Chandigarh (CDG)",
    "Dehradun (DDN)", "Haridwar (HW)", "Agra Cantt (AGC)", "Gwalior (GWL)",
    "Ranchi (RNC)", "Bhubaneswar (BBS)", "Guwahati (GHY)", "Thiruvananthapuram (TVC)",
    "Kochi Ernakulam (ERS)", "Coimbatore (CBE)", "Madurai (MDU)", "Visakhapatnam (VSKP)",
    "Vijayawada (BZA)", "Raipur (R)", "Jabalpur (JBP)", "Surat (ST)",
    "Vadodara (BRC)", "Rajkot (RJT)", "Jodhpur (JU)", "Udaipur (UDZ)",
    "Ajmer (AII)", "Gorakhpur (GKP)", "Meerut (MTC)", "Ghaziabad (GZB)",
    "Howrah (HWH)", "Dhanbad (DHN)", "Bokaro (BKSC)", "Jamshedpur (TATA)",
    "Durgapur (DGR)", "Asansol (ASN)", "Kharagpur (KGP)", "Cuttack (CTC)",
    "Sambalpur (SBP)", "Tirupati (TPTY)", "Mangalore (MAQ)", "Mysore (MYS)",
    "Hubli (UBL)", "Belgaum (BGM)", "Goa Madgaon (MAO)", "Goa Vasco (VSG)",
    "Jammu Tawi (JAT)", "Katra (SVDK)", "Mathura (MTJ)", "Bareilly (BE)",
    "Moradabad (MB)", "Aligarh (ALJN)", "Aurangabad (AWB)", "Nashik (NK)",
    "Kolhapur (KOP)", "Solapur (SUR)", "Bilaspur (BSP)", "Itarsi (ET)",
    "Katni (KTE)", "Satna (STA)", "Rewa (REWA)", "Gaya (GAYA)",
    "Muzaffarpur (MFP)", "Darbhanga (DBG)", "Samastipur (SPJ)", "Bhagalpur (BGP)",
    "Siwan (SV)", "Chapra (CPR)", "Barauni (BJU)", "Katihar (KIR)",
    "New Jalpaiguri (NJP)", "Siliguri (SGUJ)", "Malda Town (MLDT)",
    "Dibrugarh (DBRG)", "Jorhat (JRH)", "Tinsukia (NTSK)",
    "Silchar (SCL)", "Agartala (AGTL)", "Rangia (RNY)"
  ];

  // ─── POPULAR TRAINS ───────────────────────────
  const trains = [
    { name: "Rajdhani Express", number: "12301/12302", routes: ["NDLS-HWH", "HWH-NDLS", "NDLS-MMCT", "MMCT-NDLS", "NDLS-MAS", "MAS-NDLS", "NDLS-SBC", "SBC-NDLS", "NDLS-PNBE", "PNBE-NDLS"] },
    { name: "Shatabdi Express", number: "12001/12002", routes: ["NDLS-LKO", "LKO-NDLS", "NDLS-CDG", "CDG-NDLS", "MAS-SBC", "SBC-MAS", "NDLS-JP", "JP-NDLS", "MAS-CBE", "CBE-MAS"] },
    { name: "Duronto Express", number: "12213/12214", routes: ["NDLS-PNBE", "PNBE-NDLS", "NDLS-HWH", "HWH-NDLS", "MMCT-HWH", "HWH-MMCT", "NDLS-MMCT", "MMCT-NDLS"] },
    { name: "Vande Bharat Express", number: "22435/22436", routes: ["NDLS-BSB", "BSB-NDLS", "NDLS-JP", "JP-NDLS", "SC-SBC", "SBC-SC", "NDLS-SVDK", "SVDK-NDLS", "MAS-SBC", "SBC-MAS", "MMCT-SBC", "SBC-MMCT"] },
    { name: "Garib Rath Express", number: "12201/12202", routes: ["NDLS-MMCT", "MMCT-NDLS", "NDLS-PNBE", "PNBE-NDLS", "NDLS-LKO", "LKO-NDLS"] },
    { name: "Sampark Kranti Express", number: "12649/12650", routes: ["NDLS-MAS", "MAS-NDLS", "NDLS-SBC", "SBC-NDLS", "NDLS-SC", "SC-NDLS"] },
    { name: "Humsafar Express", number: "22945/22946", routes: ["NDLS-MMCT", "MMCT-NDLS", "NDLS-SBC", "SBC-NDLS", "PNBE-NDLS", "NDLS-PNBE"] },
    { name: "Tejas Express", number: "22119/22120", routes: ["MMCT-MAO", "MAO-MMCT", "NDLS-LKO", "LKO-NDLS", "MAS-MDU", "MDU-MAS"] },
    { name: "August Kranti Rajdhani", number: "12953/12954", routes: ["MMCT-NDLS", "NDLS-MMCT"] },
    { name: "Punjab Mail", number: "12137/12138", routes: ["MMCT-FZR", "FZR-MMCT"] },
    { name: "Tamil Nadu Express", number: "12621/12622", routes: ["NDLS-MAS", "MAS-NDLS"] },
    { name: "GT Express", number: "12615/12616", routes: ["NDLS-MAS", "MAS-NDLS"] },
    { name: "AP Express", number: "12723/12724", routes: ["NDLS-SC", "SC-NDLS"] },
    { name: "Poorva Express", number: "12381/12382", routes: ["NDLS-HWH", "HWH-NDLS"] },
    { name: "Kalka Mail", number: "12311/12312", routes: ["HWH-NDLS", "NDLS-HWH"] },
    { name: "Mumbai Mail", number: "12321/12322", routes: ["HWH-MMCT", "MMCT-HWH"] },
    { name: "Prayagraj Express", number: "12417/12418", routes: ["NDLS-PRYJ", "PRYJ-NDLS"] },
    { name: "Mahabodhi Express", number: "12397/12398", routes: ["NDLS-GAYA", "GAYA-NDLS"] },
    { name: "Swatantrata Senani", number: "12561/12562", routes: ["NDLS-DBG", "DBG-NDLS"] },
    { name: "North East Express", number: "12505/12506", routes: ["NDLS-GHY", "GHY-NDLS"] },
    { name: "Dibrugarh Rajdhani", number: "12423/12424", routes: ["NDLS-DBRG", "DBRG-NDLS"] },
    { name: "Howrah Rajdhani", number: "12301/12302", routes: ["NDLS-HWH", "HWH-NDLS"] },
    { name: "Mumbai Rajdhani", number: "12951/12952", routes: ["NDLS-MMCT", "MMCT-NDLS"] },
    { name: "Jan Shatabdi Express", number: "12051/12052", routes: ["NDLS-CDG", "CDG-NDLS", "MAS-SBC", "SBC-MAS", "NDLS-DDN", "DDN-NDLS"] },
    { name: "Superfast Express", number: "Various", routes: ["*"] },
    { name: "Express / Mail", number: "Various", routes: ["*"] },
    { name: "Other Train (Specify in notes)", number: "-", routes: ["*"] }
  ];

  // ─── POPULAR AIRPORTS / CITIES ─────────────────
  const airports = [
    "Delhi (DEL)", "Mumbai (BOM)", "Bangalore (BLR)", "Chennai (MAA)",
    "Kolkata (CCU)", "Hyderabad (HYD)", "Ahmedabad (AMD)", "Pune (PNQ)",
    "Goa (GOI)", "Jaipur (JAI)", "Lucknow (LKO)", "Kochi (COK)",
    "Chandigarh (IXC)", "Bhubaneswar (BBI)", "Indore (IDR)", "Nagpur (NAG)",
    "Patna (PAT)", "Varanasi (VNS)", "Coimbatore (CJB)", "Thiruvananthapuram (TRV)",
    "Guwahati (GAU)", "Srinagar (SXR)", "Amritsar (ATQ)", "Mangalore (IXE)",
    "Dehradun (DED)", "Ranchi (IXR)", "Visakhapatnam (VTZ)", "Madurai (IXM)",
    "Raipur (RPR)", "Bhopal (BHO)", "Udaipur (UDR)", "Jodhpur (JDH)",
    "Bagdogra (IXB)", "Imphal (IMF)", "Agartala (IXA)", "Leh (IXL)",
    "Jammu (IXJ)", "Vadodara (BDQ)", "Surat (STV)", "Rajkot (RAJ)",
    "Tiruchirappalli (TRZ)", "Vijayawada (VGA)", "Hubli (HBX)",
    "Mysore (MYQ)", "Aurangabad (IXU)", "Silchar (IXS)", "Dibrugarh (DIB)",
    "Port Blair (IXZ)", "Shimla (SLV)", "Dharamshala Gaggal (DHM)"
  ];

  // ─── POPULAR AIRLINES ─────────────────────────
  const airlines = [
    "IndiGo", "Air India", "SpiceJet", "Vistara", "GoFirst (Go Air)",
    "AirAsia India", "Akasa Air", "Alliance Air", "Star Air", "Any / Best Price"
  ];

  return { stations, trains, airports, airlines };
})();
