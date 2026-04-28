export interface DirectoryEntry {
  name: string;
  address?: string;
  poBox?: string;
  city?: string;
  country: string;
  phone?: string;
  fax?: string;
  email?: string;
  website?: string;
  tollfree?: string;
  image?: string; // Path to organization image or logo
  type: 'ministry' | 'parastatal' | 'agency' | 'local_authority' | 'utility' | 'other';
}

export const botswanaDirectory: DirectoryEntry[] = [
  // MINISTRIES
  {
    name: "Ministry for State President Defense and Security",
    poBox: "Private Bag 001",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 0800/0869",
    fax: "+267 390 4017",
    website: "www.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Lands and Agriculture",
    address: "Plot Number 4701, Station Road",
    city: "Gaborone",
    poBox: "Private Bag 003",
    country: "Botswana",
    phone: "+267 3368 9000",
    website: "www.moa.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Justice and Correctional Services",
    poBox: "Private Bag 00384",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 369 8200/397 3977",
    tollfree: "0800 600 971",
    fax: "+267 3933034",
    website: "www.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Childwelfare and Basic Education",
    address: "Building Block 6, Government Enclave",
    poBox: "Private Bag 005",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 365 5400",
    fax: "+267 365 5458",
    tollfree: "0800 6006 78",
    website: "www.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Wildlife and Tourism",
    poBox: "Private Bag BO199",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 391 4955",
    fax: "+267 3951092",
    website: "www.newt.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Finance and Development Planning",
    address: "Government Enclave, Khama Crescent, Block 25, State Drive",
    poBox: "Private Bag 008",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 3950100",
    fax: "+267 3905742",
    website: "www.finance.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of International Relations",
    poBox: "Private Bag 00365",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 3600700",
    tollfree: "0800 600 983",
    website: "www.mofaic.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Health & Wellness",
    poBox: "Private Bag 0038",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 363 2500/317 0585",
    tollfree: "0800 600 740",
    fax: "health@gov.bw",
    website: "www.moh.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Transport and Infrastructure",
    address: "Fairgrounds Office Park, Plot 61923",
    poBox: "Private Bag 007",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 397 2255/395 8500/315 8447",
    fax: "+267 391 3303/310 2559",
    tollfree: "0800 600 789",
    website: "www.mist.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Labour and Home Affairs",
    address: "Block 8, Government Enclave, Khama Crescent",
    poBox: "Private Bag 002",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 361 1100/361 1180/361 1132",
    tollfree: "0800 600 777",
    fax: "+267 390 7426",
    website: "www.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Water & Human Settlement",
    address: "AKD House (Former Capitol Building) Main Mall",
    city: "Gaborone",
    poBox: "Private Bag 00434",
    country: "Botswana",
    phone: "+267 368 2000",
    fax: "+267 391 1591",
    tollfree: "0800 600 737",
    website: "www.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Local Government and Traditional Affairs",
    address: "Government Enclave, Behind Police Headquarters, In front of Ministry of Health and Attorney General Chamber, Gaborone Central",
    poBox: "Private Bag 006",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 365 8400",
    fax: "+267 365 2382",
    tollfree: "0800 600 718",
    website: "www.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Minerals & Energy",
    address: "Fairgrounds Office Park, Block C, Plot No 50676, Machel Drive (Opposite Stanbic Bank)",
    poBox: "Private Bag 0018",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 365 6600",
    fax: "+267 397 2738",
    website: "www.mmewr.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Trade and Entrepreneurship",
    poBox: "Private Bag 004",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 360 1200",
    fax: "+267 397 1539",
    type: "ministry"
  },
  {
    name: "Ministry of Communications and Innovation",
    poBox: "Private Bag 00414",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 361 2000",
    fax: "+267 390 7236",
    website: "www.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Youth and Gender Affairs",
    poBox: "Private Bag 00514",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 368 2600/390 1186",
    fax: "+267 391 3473/390 1557",
    tollfree: "0800 600 883",
    website: "www.mysc.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Higher Education",
    poBox: "Private Bag 005",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 365 5400",
    fax: "+267 365 5458",
    type: "ministry"
  },

  // PARASTATALS AND AGENCIES
  {
    name: "Administration of Justice (AOJ)",
    address: "Lobatse High Court",
    poBox: "Private Bag 001",
    city: "Lobatse",
    country: "Botswana",
    phone: "+267 533 0396",
    fax: "+267 533 2317",
    website: "www.justice.gov.bw",
    type: "agency"
  },
  {
    name: "Attorney General's Chambers (AGC)",
    poBox: "Private Bag 009",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 361 3928",
    fax: "+267 393 0261",
    website: "www.age.gov.bw",
    type: "agency"
  },
  {
    name: "Bank of Botswana",
    address: "17938, Khama Crescent",
    poBox: "Private Bag 154",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 360 6000",
    website: "www.bankofbotswana.bw",
    image: "/images/parastatalslogos/bank of botswana logo.png",
    type: "parastatal"
  },
  {
    name: "Botswana Bureau of Standards",
    address: "Main Airport Road, Plot No. 55745, Block 8",
    poBox: "Private Bag BO 48",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 390 3200",
    fax: "+267 390 3120",
    email: "infoc@hq.bobstandards.bw",
    website: "www.bobstandards.bw",
    image: "/images/parastatalslogos/botswana bureau of standards.png",
    type: "parastatal"
  },
  {
    name: "Botswana Defence Force (BDF)",
    poBox: "Private Bag X06",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 366 2100",
    fax: "+267 397 3600",
    website: "www.gov.bw",
    type: "agency"
  },
  {
    name: "Botswana Development Corporation",
    address: "Moedi, Plot 50380, Gaborone International Showgrounds",
    poBox: "Private Bag 160",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 365 1300",
    fax: "+267 390 3114/4193",
    email: "enquiries@bdc.bw",
    website: "www.bdc.bw",
    image: "/images/parastatalslogos/botswana development corporation logo.jpg",
    type: "parastatal"
  },
  {
    name: "Botswana Examination Council",
    address: "Plot 54864, K.T. Motsete Road",
    poBox: "Private Bag 0070",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 365 0700",
    fax: "+267 318 5011",
    website: "www.bec.co.bw",
    image: "/images/parastatalslogos/botswana examinations council logo.png",
    type: "parastatal"
  },
  {
    name: "Botswana Export Development and Investment Authority (BEDIA)",
    address: "Plot 54351, Exponential Building, next to Masa Centre, at the Central Business District (CBD)",
    poBox: "Private Bag 00445",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 363 3300",
    fax: "+267 317 0452",
    email: "enquiries@bitc.co.bw",
    website: "www.bedia.co.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Innovation Hub (BIH)",
    address: "Maranyane House, Plot 50654 Machel Drive",
    poBox: "Private Bag 00265",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 391 3328",
    fax: "+267 391 3289",
    email: "info@bih.co.bw",
    website: "www.bih.co.bw",
    image: "/images/parastatalslogos/botswana innovation hub logo.png",
    type: "parastatal"
  },
  {
    name: "Botswana Institute of Development Policy Analysis (BIDPA)",
    address: "Plot 134 Tshwene Drive, International Finance Park",
    poBox: "Private Bag BR-29",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 397 1750",
    fax: "+267 397 1748",
    image: "/images/parastatalslogos/bidpa logo.jpg",
    type: "parastatal"
  },
  {
    name: "Botswana International Financial Service",
    address: "Plot 50676, Fairgrounds Office Park",
    poBox: "Private Bag 160",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 360 5000",
    fax: "+267 391 3075",
    website: "www.ifsc.co.bw",
    type: "parastatal"
  },
  {
    name: "Botswana National Sports Council (BNSC)",
    address: "Botswana National Stadium",
    poBox: "P.O. Box 1404",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 3449/367 4000",
    fax: "+267 390 1607",
    email: "sport@bnsc.co.bw",
    website: "www.bnsc.co.bw",
    image: "/images/parastatalslogos/bnsc.png",
    type: "parastatal"
  },
  {
    name: "Botswana Police Service (BPS)",
    address: "Police Headquarters, Government Enclave",
    poBox: "Private Bag 0012",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 1161",
    fax: "+267 397 3723",
    website: "www.police.gov.bw",
    type: "agency"
  },
  {
    name: "Botswana Prison Service",
    poBox: "Private Bag X02",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 361 1700",
    fax: "+267 397 5003",
    website: "www.gov.bw",
    type: "agency"
  },
  {
    name: "Botswana Savings Bank (BSB)",
    address: "BSB Tshomarelo House, Corner Lekgarapa/Letswai Road, Plot 53796, Broadhurst Mall",
    poBox: "P.O. Box 1150",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 391 2555",
    fax: "+267 395 2608",
    website: "www.bsb.bw",
    image: "/images/parastatalslogos/botswana savings bank.png",
    type: "parastatal"
  },
  {
    name: "Botswana Stock Exchange (BSE)",
    address: "EXCHANGE HOUSE, Office Block 6, Plot 64511, Fairgrounds",
    poBox: "Private Bag 00417",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 318 0201",
    fax: "+267 318 0175",
    image: "/images/parastatalslogos/botswana stock exchange.png",
    type: "parastatal"
  },
  {
    name: "Botswana Technology Centre (BOTEC)",
    address: "Plot 50654, Machel Drive, Maranyane House",
    poBox: "Private Bag 0082",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 391 4161/360 7500",
    fax: "+267 397 4677",
    email: "scttech@bctec.bw",
    website: "www.bctec.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Communication Regulatory Authority (BOCRA)",
    address: "206/207 Independence Avenue",
    poBox: "Private Bag 00495",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 7755",
    fax: "+267 395 7976",
    email: "info@bta.org.bw",
    website: "www.bta.org.bw",
    image: "/images/parastatalslogos/bta logo.png",
    type: "parastatal"
  },
  {
    name: "Botswana Telecommunications Corporation (BTC)",
    phone: "+267 395 8000",
    website: "www.btc.bw",
    country: "Botswana",
    image: "/images/parastatalslogos/Botswana-Telecommunications-Corporation- logo.png",
    type: "parastatal"
  },
  {
    name: "Botswana Tertiary Council",
    address: "Lot 60113, Extension 48, Block 7, Gaborone West",
    poBox: "Private Bag BR 108",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 393 0741",
    fax: "+267 393 0814/0740",
    email: "info@tec.org.bw",
    website: "www.tec.org.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Tourism Board",
    address: "Plot 50676, Fairgrounds Office Park, Blocks B & D",
    poBox: "Private Bag 00275",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 391 3111/310 5601",
    email: "board@botswanatourism.co.bw",
    website: "www.botswanatourism.co.bw",
    image: "/images/parastatalslogos/botswana tourism.jpg",
    type: "parastatal"
  },
  {
    name: "Botswana Training Authority (BOTA)",
    address: "Plot 66450, Block 7",
    poBox: "Private Bag BO 340",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 365 7200",
    fax: "+267 395 2301",
    tollfree: "0800 600 934",
    website: "www.bota.org.bw",
    image: "/images/parastatalslogos/bota logo.jpg",
    type: "parastatal"
  },
  {
    name: "Botswana Unified Revenue Service (BURS)",
    address: "Plot 53976, Kudumates Drive",
    poBox: "Private Bag 0013",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 363 8000/9000",
    fax: "+267 363 9999/395 3101",
    email: "comms@burs.org.bw",
    website: "www.burs.org.bw",
    type: "parastatal"
  },
  {
    name: "Citizen Entrepreneurial Development Agency (CEDA)",
    address: "CEDA House, Prime Plaza, Plot 54358, Corner PG Matante Road & Khama Crescent Extension, CBD",
    poBox: "Private Bag BR-29",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 317 0895",
    fax: "+267 391 3841",
    website: "www.ceda.co.bw",
    image: "/images/parastatalslogos/ceda logo.jpg",
    type: "parastatal"
  },
  {
    name: "Directorate on Corruption and Economic Crime (DCEC)",
    poBox: "Private Bag 00344",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 391 4002",
    fax: "+267 391 3508",
    tollfree: "0800 700 100",
    email: "deec@gov.bw/reporttodcec@gov.bw",
    website: "www.dcec.gov.bw",
    type: "agency"
  },
  {
    name: "Directorate of Public Service Management (DPSM)",
    address: "Attorney Generals Chambers Building, Government Enclave, Plot 50762",
    poBox: "Private Bag 0011",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 362 2600",
    fax: "+267 318 1375/390 6671",
    email: "dpsm_pro@gov.bw",
    website: "www.dpsm.gov.bw",
    type: "agency"
  },
  {
    name: "Independent Electoral Commission (IEC) Botswana",
    address: "Block 8, 7th Floor, Government Enclave",
    poBox: "Private Bag 00284",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 361 2400",
    fax: "+267 319 0889/390 0581/5205",
    website: "www.iec.gov.bw",
    type: "agency"
  },
  {
    name: "Industrial Court (IC)",
    address: "Plot No 62439, New Central Business District, Opposite Dikgosi Monuments",
    poBox: "Private Bag BR 267, Broadhurst",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 390 0565",
    fax: "+267 390 0567",
    website: "www.gov.bw",
    type: "agency"
  },
  {
    name: "Motor Vehicle Accidents Fund (MVAF)",
    address: "3rd Floor, MVA Fund House, Plot 50367, Fairgrounds Office Park",
    poBox: "Private Bag 00438",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 318 8533/8533/360 0100",
    fax: "+267 318 8124/8545",
    email: "mvafund@mvafund.bw",
    website: "www.mvafund.bw",
    image: "/images/parastatalslogos/mva fund logo.png",
    type: "parastatal"
  },
  {
    name: "National Aids Coordinating Agency (NACA)",
    poBox: "Private Bag 00463",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 371 0314",
    fax: "+267 317 0960",
    email: "asknaca@gov.bw",
    website: "www.oag.org.bw",
    type: "agency"
  },
  {
    name: "National Development Bank (NDB)",
    address: "Development House, The Mall",
    poBox: "P.O. Box 225",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 352 801",
    fax: "+267 374 446",
    website: "www.finance.gov.bw",
    image: "/images/parastatalslogos/ndb logo.png",
    type: "parastatal"
  },
  {
    name: "Non-Bank Financial Institutions Regulatory Authority (NBFIRA)",
    address: "3rd floor, Exponential Building, Plot 54351 New CBD, Off PG Matante Road",
    poBox: "Private Bag 00314",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 310 2595/368 6100",
    fax: "+267 310 2376/2353",
    website: "www.nbfira.org.bw",
    type: "parastatal"
  },
  {
    name: "Office of the Auditor General (OAG)",
    address: "Gaborone Farm Forest Hill No. 9 Lot 134 Millenium Park, Kgale Hill",
    poBox: "Private Bag 0010",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 361 7100/7158/395 1050",
    fax: "+267 318 8145",
    email: "oag@gov.bw",
    website: "www.oag.org.bw",
    type: "agency"
  },
  {
    name: "Office of the Ombudsman (OMB)",
    address: "Plot 21, Corner of Queen's Road & Khama Crescent, The Mall",
    poBox: "Private Bag 0010",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 3322",
    fax: "+267 395 3539",
    email: "ombudsman@gov.bw",
    website: "www.ombudsman.gov.bw",
    type: "agency"
  },
  {
    name: "Public Enterprises, Evaluation and Privatisation Agency (PEEPA)",
    address: "2nd Floor, East Wing, Twin Towers, Fairgrounds Office Park",
    poBox: "Private Bag 00510",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 318 8807",
    fax: "+267 318 8662",
    email: "enquiries@peepa.co.bw",
    website: "www.peepa.co.bw",
    image: "/images/parastatalslogos/peepa.png",
    type: "parastatal"
  },
  {
    name: "Public Procurement and Asset Disposal Board (PPADB)",
    address: "Plot 8913, Maakgadigau Way, Gaborone West Industrial",
    poBox: "Private Bag 0058",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 360 2000",
    fax: "+267 390 6822",
    email: "sbpac@ppadb.co.bw",
    website: "www.ppadb.co.bw",
    image: "/images/parastatalslogos/ppadp logo.png",
    type: "parastatal"
  },
  {
    name: "The Parliament Office (PO)",
    poBox: "P.O. Box 240",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 361 6800",
    fax: "+267 391 3103",
    email: "parliament@gov.bw",
    website: "www.parliament.gov.bw",
    type: "agency"
  },

  // LOCAL AUTHORITIES
  {
    name: "Central District Council",
    poBox: "Private Bag 001",
    city: "Serowe",
    country: "Botswana",
    phone: "+267 463 0411/0482/0325/0485/0210",
    tollfree: "0800 600 796",
    website: "www.cdc.gov.bw",
    image: "/images/LogosCouncil/Serowe.jpg",
    type: "local_authority"
  },
  {
    name: "Chobe District Council",
    poBox: "Private Bag K30",
    city: "Kasane",
    country: "Botswana",
    phone: "+267 625 0275/6",
    fax: "+267 625 0368",
    website: "www.chobedistrictcouncil.gov.bw",
    image: "/images/LogosCouncil/Chobe.jpg",
    type: "local_authority"
  },
  {
    name: "City of Francistown",
    poBox: "Private Bag 40",
    city: "Francistown",
    country: "Botswana",
    phone: "+267 241 2183",
    fax: "+267 241 2027",
    tollfree: "0800 600 242",
    image: "/images/LogosCouncil/CoFC.jpg",
    type: "local_authority"
  },
  {
    name: "Gaborone City Council",
    address: "Plot 330 Independence Ave",
    poBox: "Private Bag 0089",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 365 7400",
    fax: "+267 390 0141",
    tollfree: "0800 600 061",
    website: "www.gov.bw",
    image: "/images/LogosCouncil/GCC.jpg",
    type: "local_authority"
  },
  {
    name: "Ghanzi District Council",
    poBox: "P.O. Box 78",
    city: "Ghanzi",
    country: "Botswana",
    phone: "+267 659 6211",
    fax: "+267 659 6113/6420",
    tollfree: "0800 600 770",
    website: "www.gov.bw",
    image: "/images/LogosCouncil/Ghanzi.jpg",
    type: "local_authority"
  },
  {
    name: "Jwaneng Town Council",
    poBox: "Private Bag 001",
    city: "Jwaneng",
    country: "Botswana",
    phone: "+267 588 0303",
    fax: "+267 588 1395/2609",
    tollfree: "0800 600 765",
    website: "www.jtc.gov.bw",
    image: "/images/LogosCouncil/JTC.jpg",
    type: "local_authority"
  },
  {
    name: "Kgalagadi District Council",
    address: "Main Road, Tarre, Tsabong",
    poBox: "Private Bag 004",
    city: "Tsabong",
    country: "Botswana",
    phone: "+267 654 0255/0446",
    fax: "+267 654 0252",
    tollfree: "0800 600 793",
    website: "www.gov.bw",
    image: "/images/LogosCouncil/Tsabong.jpg",
    type: "local_authority"
  },
  {
    name: "Kgatleng District Council",
    poBox: "Private Bag 011",
    city: "Mochudi",
    country: "Botswana",
    phone: "+267 577 7411",
    fax: "+267 577 7216",
    tollfree: "0800 600 880",
    email: "2dc@gov.bw",
    website: "www.kgatlengdc.gov.bw",
    image: "/images/LogosCouncil/Kgatleng.jpg",
    type: "local_authority"
  },
  {
    name: "Kweneng District Council",
    address: "Main Rd, Molepolole",
    poBox: "Private Bag 005",
    city: "Molepolole",
    country: "Botswana",
    phone: "+267 5920200/0201/0202/0204/0205/2100",
    fax: "+267 592 0287",
    tollfree: "0800 600 794",
    website: "www.gov.bw",
    image: "/images/LogosCouncil/Kweneng.jpg",
    type: "local_authority"
  },
  {
    name: "Lobatse Town Council",
    address: "Plot 1077 Gaseeitsiwe Avenue",
    poBox: "Private Bag 42",
    city: "Lobatse",
    country: "Botswana",
    phone: "+267 533 0484",
    fax: "+267 533 0484",
    tollfree: "0800 600 876",
    website: "www.gov.bw",
    type: "local_authority"
  },
  {
    name: "North East District Council",
    address: "Masunga Ward, Masunga",
    poBox: "Private Bag 004",
    city: "Masunga",
    country: "Botswana",
    phone: "+267 248 9242",
    fax: "+267 298 2070",
    tollfree: "0800 600 759",
    website: "www.gov.bw",
    image: "/images/LogosCouncil/NEDC.jpg",
    type: "local_authority"
  },
  {
    name: "North West District Council",
    address: "Old Mall RAC, Maun",
    poBox: "Private Bag 01",
    city: "Maun",
    country: "Botswana",
    phone: "+267 686 0241",
    fax: "+267 686 0029",
    tollfree: "0800 600 792",
    website: "www.gov.bw",
    image: "/images/LogosCouncil/NWDC.jpg",
    type: "local_authority"
  },
  {
    name: "Selibe Phikwe Town Council",
    address: "Council Admin Block Main Mall, Selebi-Phikwe",
    poBox: "Private Bag 001",
    city: "Selebi Phikwe",
    country: "Botswana",
    phone: "+267 261 0570",
    tollfree: "0800 600 746",
    website: "www.gov.bw",
    type: "local_authority"
  },
  {
    name: "South East District Council",
    address: "Magope Ward, Ramotswa Village, Ramotswa",
    poBox: "Private Bag 002",
    city: "Ramotswa",
    country: "Botswana",
    phone: "+267 539 0671",
    fax: "+267 539 0201",
    tollfree: "0800 600 795",
    website: "www.gov.bw",
    type: "local_authority"
  },
  {
    name: "Southern District Council",
    poBox: "Private Bag 002",
    city: "Kanye",
    country: "Botswana",
    phone: "+267 544 0651",
    fax: "+267 544 0217",
    tollfree: "0800 600 776",
    website: "www.gov.bw",
    image: "/images/LogosCouncil/Kanye.jpg",
    type: "local_authority"
  },
  {
    name: "Sowa Town Council",
    phone: "+267 621 3440",
    fax: "+267 621 3425",
    tollfree: "0800 600 754",
    website: "www.gov.bw",
    country: "Botswana",
    image: "/images/LogosCouncil/Sowa.jpg",
    type: "local_authority"
  },

  // UTILITIES AND OTHER
  {
    name: "Air Botswana",
    address: "Sir Seretse Khama International Airport",
    poBox: "P.O. Box 92",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 368 8400/395 2812",
    fax: "+267 397 4802",
    email: "sales@airbotswana.co.bw",
    website: "www.airbotswana.co.bw",
    type: "parastatal"
  }
];

// Utility function to filter by type
export function getDirectoryByType(type: DirectoryEntry['type']): DirectoryEntry[] {
  return botswanaDirectory.filter(entry => entry.type === type);
}

// Utility function to search by name
export function searchDirectory(query: string): DirectoryEntry[] {
  const searchTerm = query.toLowerCase();
  return botswanaDirectory.filter(entry => 
    entry.name.toLowerCase().includes(searchTerm) ||
    entry.city?.toLowerCase().includes(searchTerm) ||
    entry.type.toLowerCase().includes(searchTerm)
  );
}