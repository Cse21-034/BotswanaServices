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

export const namibiaDirectory: DirectoryEntry[] = [
  // MINISTRIES
  {
    name: "Office of the President",
    address: "State House, Khama Crescent",
    city: "Gaborone",
    country: "Botswana",
    poBox: "Private Bag 001",
    phone: "+267 395 0800",
    website: "www.statehouse.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Finance and Economic Development",
    address: "Government Enclave, Khama Crescent",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 0128",
    website: "www.finance.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Health and Wellness",
    address: "Plot 50375, Block 6",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 363 1500",
    tollfree: "0800 600 666",
    website: "www.moh.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Education and Skills Development",
    address: "Government Enclave, Central Business District",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 365 2400",
    website: "www.moe.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Land Management, Water and Sanitation Services",
    address: "Plot 50676, Fairgrounds Office Park",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 393 2201",
    website: "www.mlws.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Minerals and Energy",
    address: "Plot 1, Khama Crescent",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 365 8500",
    website: "www.minerals.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Defence, Justice and Security",
    address: "Government Enclave, Independence Avenue",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 391 1400",
    website: "www.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Trade and Industry",
    address: "Plot 54388, Central Business District",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 360 1200",
    website: "www.mti.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Youth, Gender and Sport",
    address: "Plot 50808, Gaborone International Commerce Park",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 390 0279",
    website: "www.mysc.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Environment, Natural Resources Conservation and Tourism",
    address: "Plot 68697, Eco Innovation Centre",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 391 2961",
    website: "www.ment.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Transport and Communications",
    address: "Plot 108, Government Enclave",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 368 1300",
    website: "www.motc.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Local Government and Rural Development",
    address: "Government Enclave, Private Bag 006",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 2541",
    website: "www.mlgrd.gov.bw",
    type: "ministry"
  },
  {
    name: "Ministry of Foreign Affairs",
    address: "Government Enclave, Private Bag 00368",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 1863",
    website: "www.gov.bw/foreign-affairs",
    type: "ministry"
  },

  // PARASTATALS / STATE-OWNED ENTITIES
  {
    name: "Bank of Botswana",
    address: "Plot 1863, Khama Crescent",
    city: "Gaborone",
    country: "Botswana",
    poBox: "P.O. Box 712",
    phone: "+267 360 6000",
    website: "www.bankofbotswana.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Savings Bank",
    address: "BSB House, Plot 1133, Mogoditshane Drive",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 361 6800",
    website: "www.bsb.co.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Development Corporation",
    address: "Fairgrounds Office Park, Block B",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 351 4000",
    website: "www.bdc.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Tourism Organisation",
    address: "Plot 50357, Fairgrounds Office Park",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 3024",
    email: "info@botswanatourism.co.bw",
    website: "www.botswanatourism.co.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Investment and Trade Centre",
    address: "Plot 50380, Fairgrounds Office Park",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 363 3300",
    website: "www.bitc.co.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Unified Revenue Service (BURS)",
    address: "Plot 14, Kudumatse Drive",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 363 9000",
    tollfree: "0800 600 027",
    website: "www.burs.org.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Power Corporation",
    address: "Plot 1396, Mogorosi Road",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 360 2200",
    tollfree: "0800 600 234",
    website: "www.bpc.bw",
    type: "parastatal"
  },
  {
    name: "Water Utilities Corporation",
    address: "Plot 10936, Lobatse Road",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 363 5500",
    website: "www.wuc.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Telecommunications Corporation (BTC)",
    address: "Plot 50671, Machel Drive, Fairgrounds",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 8000",
    website: "www.btc.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Post",
    address: "Plot 130, Khama Crescent",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 0300",
    website: "www.botswanapost.co.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Housing Corporation",
    address: "Plot 1117, Lobatse Road",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 360 5100",
    website: "www.bhc.bw",
    type: "parastatal"
  },
  {
    name: "Botswana Stock Exchange",
    address: "Plot 64433, Fairgrounds Office Park",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 318 7928",
    website: "www.bse.co.bw",
    type: "parastatal"
  },

  // LOCAL AUTHORITIES
  {
    name: "Gaborone City Council",
    address: "PO Box 17, Civic Centre, Khama Crescent",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 0444",
    website: "www.gabcity.gov.bw",
    type: "local_authority"
  },
  {
    name: "Francistown City Council",
    address: "Town House, Plot 21A, Blue Jacket Street",
    city: "Francistown",
    country: "Botswana",
    phone: "+267 241 3000",
    website: "www.francistown.gov.bw",
    type: "local_authority"
  },
  {
    name: "Selebi-Phikwe Town Council",
    address: "P.O. Box 20, Town House",
    city: "Selebi-Phikwe",
    country: "Botswana",
    phone: "+267 261 0300",
    website: "www.sptown.gov.bw",
    type: "local_authority"
  },
  {
    name: "Lobatse Town Council",
    address: "P.O. Box 35, Town Hall",
    city: "Lobatse",
    country: "Botswana",
    phone: "+267 533 0281",
    website: "www.gov.bw",
    type: "local_authority"
  },
  {
    name: "Jwaneng Town Council",
    address: "P.O. Box 63, Civic Centre",
    city: "Jwaneng",
    country: "Botswana",
    phone: "+267 588 0241",
    website: "www.gov.bw",
    type: "local_authority"
  },
  {
    name: "Maun Sub-District Council",
    address: "P.O. Box 16, Maun",
    city: "Maun",
    country: "Botswana",
    phone: "+267 686 0268",
    website: "www.gov.bw",
    type: "local_authority"
  },

  // UTILITIES & AGENCIES
  {
    name: "Botswana Fibre Networks (BoFiNet)",
    address: "Plot 50671, Fairgrounds Office Park",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 368 1700",
    website: "www.bofinet.co.bw",
    type: "utility"
  },
  {
    name: "Civil Aviation Authority of Botswana",
    address: "Plot 64511, Sir Seretse Khama International Airport",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 368 3400",
    website: "www.caab.co.bw",
    type: "utility"
  },
  {
    name: "Botswana Railways",
    address: "P.O. Box 52, Madinare Ward",
    city: "Mahalapye",
    country: "Botswana",
    phone: "+267 471 2916",
    website: "www.botrail.co.bw",
    type: "utility"
  },
  {
    name: "Roads Department",
    address: "Plot 50369, Government Enclave",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 368 1700",
    website: "www.roads.gov.bw",
    type: "utility"
  },
  {
    name: "Botswana Meat Commission",
    address: "P.O. Box 4, Lobatse Road",
    city: "Lobatse",
    country: "Botswana",
    phone: "+267 533 0321",
    website: "www.bmc.bw",
    type: "agency"
  },
  {
    name: "Independent Electoral Commission",
    address: "Plot 50362, Fairgrounds Office Park",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 361 6800",
    website: "www.iec.gov.bw",
    type: "agency"
  },
  {
    name: "Statistics Botswana",
    address: "Plot 8843, Fairgrounds Office Park",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 367 1300",
    website: "www.statsbots.org.bw",
    type: "agency"
  },
  {
    name: "Botswana Qualifications Authority",
    address: "Plot 50367, Block 3, Fairgrounds",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 318 5385",
    website: "www.bqa.org.bw",
    type: "agency"
  },
  {
    name: "Botswana Human Rights Commission",
    address: "Plot 1097, Khama Crescent",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 8000",
    tollfree: "0800 600 853",
    website: "www.gov.bw",
    type: "agency"
  },
  {
    name: "Competition Authority of Botswana",
    address: "Plot 54355, CBD, Private Bag BO 229",
    city: "Gaborone",
    country: "Botswana",
    phone: "+267 395 2784",
    website: "www.competitionauthority.co.bw",
    type: "agency"
  }
];

export function getDirectoryByType(type: DirectoryEntry['type']): DirectoryEntry[] {
  return namibiaDirectory.filter(entry => entry.type === type);
}
