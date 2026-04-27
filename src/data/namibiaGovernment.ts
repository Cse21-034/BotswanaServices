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
  image?: string;
  type: 'ministry' | 'parastatal' | 'agency' | 'local_authority' | 'utility' | 'other';
}

export const namibiaDirectory: DirectoryEntry[] = [
  // DEPARTMENTS (MINISTRIES)
  {
    name: "The Presidency",
    address: "Union Buildings, Government Avenue",
    city: "Pretoria",
    country: "South Africa",
    poBox: "Private Bag X1000",
    phone: "+27 12 300 5200",
    website: "www.thepresidency.gov.za",
    type: "ministry"
  },
  {
    name: "Department of International Relations and Cooperation",
    address: "OR Tambo Building, 460 Soutpansberg Road",
    city: "Pretoria",
    country: "South Africa",
    poBox: "Private Bag X152",
    phone: "+27 12 351 1000",
    website: "www.dirco.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Justice and Constitutional Development",
    address: "Momentum Centre, 329 Pretorius Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 315 1111",
    website: "www.justice.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Defence",
    address: "Armscor Building, Nossob Street, Erasmuskloof",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 355 6000",
    website: "www.dod.mil.za",
    type: "ministry"
  },
  {
    name: "South African Police Service",
    address: "Wachthuis Building, 231 Pretorius Street",
    city: "Pretoria",
    country: "South Africa",
    tollfree: "10111",
    phone: "+27 12 393 1000",
    website: "www.saps.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Agriculture, Land Reform and Rural Development",
    address: "20 Steve Biko Road, Arcadia",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 319 7000",
    website: "www.dalrrd.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Forestry, Fisheries and the Environment",
    address: "Environment House, 473 Steve Biko Road",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 399 8000",
    website: "www.dffe.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Mineral Resources and Energy",
    address: "Trevenna Campus, 70 Meintjes Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 444 3000",
    website: "www.dmre.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Trade, Industry and Competition",
    address: "77 Meintjes Street, Sunnyside",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 394 9500",
    website: "www.thedtic.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Basic Education",
    address: "Sol Plaatje House, 222 Struben Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 357 3000",
    website: "www.education.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Health",
    address: "Civitas Building, Cnr Struben & Andries Streets",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 395 8000",
    website: "www.health.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Social Development",
    address: "HSRC Building, 134 Pretorius Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 312 7500",
    website: "www.dsd.gov.za",
    type: "ministry"
  },
  {
    name: "Department of Public Enterprises",
    address: "Infotech Building, 1090 Arcadia Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 431 1000",
    website: "www.dpe.gov.za",
    type: "ministry"
  },
  {
    name: "National Treasury",
    address: "240 Madiba Street, Pretoria Central",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 315 5111",
    website: "www.treasury.gov.za",
    type: "ministry"
  },

  // PARASTATALS / STATE-OWNED ENTITIES
  {
    name: "South African Reserve Bank",
    address: "370 Helen Joseph Street, Pretoria Central",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 313 3911",
    website: "www.resbank.co.za",
    type: "parastatal"
  },
  {
    name: "Industrial Development Corporation",
    address: "19 Fredman Drive, Sandton",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 269 3000",
    website: "www.idc.co.za",
    type: "parastatal"
  },
  {
    name: "South African Bureau of Standards",
    address: "1 Dr Lategan Road, Groenkloof",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 428 7911",
    website: "www.sabs.co.za",
    type: "parastatal"
  },
  {
    name: "Development Bank of Southern Africa",
    address: "1258 Lever Road, Headway Hill, Midrand",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 313 3911",
    website: "www.dbsa.org",
    type: "parastatal"
  },
  {
    name: "South African Qualifications Authority",
    address: "SAQA House, 1067 Arcadia Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 431 5000",
    website: "www.saqa.org.za",
    type: "parastatal"
  },
  {
    name: "National Youth Development Agency",
    address: "29 Kerk Street, Johannesburg",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 651 7000",
    website: "www.nyda.gov.za",
    type: "parastatal"
  },
  {
    name: "Financial Sector Conduct Authority",
    address: "Riverwalk Office Park, 41 Matroosberg Road, Ashlea Gardens",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 428 8000",
    tollfree: "0800 20 37 22",
    website: "www.fsca.co.za",
    type: "parastatal"
  },
  {
    name: "Johannesburg Stock Exchange",
    address: "One Exchange Square, 2 Gwen Lane, Sandown",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 520 7000",
    website: "www.jse.co.za",
    type: "parastatal"
  },
  {
    name: "South African National Roads Agency",
    address: "Old Mutual Building, 200 Navarre Street",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 426 6000",
    website: "www.sanral.co.za",
    type: "parastatal"
  },
  {
    name: "Independent Communications Authority of South Africa",
    address: "350 Witch-Hazel Avenue, Eco Park, Centurion",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 568 3000",
    website: "www.icasa.org.za",
    type: "parastatal"
  },
  {
    name: "Telkom SA SOC Limited",
    address: "61 Oak Avenue, Highveld Technopark, Centurion",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 311 3000",
    website: "www.telkom.co.za",
    type: "parastatal"
  },
  {
    name: "South African Tourism",
    address: "Bojanala House, 90 Protea Road, Chislehurston",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 895 3000",
    email: "info@southafrica.net",
    website: "www.southafrica.net",
    type: "parastatal"
  },
  {
    name: "South African Revenue Service",
    address: "299 Bronkhorst Street, Nieuw Muckleneuk",
    city: "Pretoria",
    country: "South Africa",
    tollfree: "0800 00 7277",
    phone: "+27 12 422 4000",
    website: "www.sars.gov.za",
    type: "parastatal"
  },

  // LOCAL AUTHORITIES (METROPOLITAN MUNICIPALITIES)
  {
    name: "City of Johannesburg Metropolitan Municipality",
    address: "Civic Centre, 158 Loveday Street, Braamfontein",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 407 6111",
    website: "www.joburg.org.za",
    type: "local_authority"
  },
  {
    name: "City of Cape Town Metropolitan Municipality",
    address: "12 Hertzog Boulevard, Foreshore",
    city: "Cape Town",
    country: "South Africa",
    phone: "+27 21 400 1111",
    website: "www.capetown.gov.za",
    type: "local_authority"
  },
  {
    name: "eThekwini Metropolitan Municipality",
    address: "City Hall, Anton Lembede Street",
    city: "Durban",
    country: "South Africa",
    phone: "+27 31 311 1111",
    website: "www.durban.gov.za",
    type: "local_authority"
  },
  {
    name: "City of Tshwane Metropolitan Municipality",
    address: "Centurion Civic Centre, c/r Basden & Rabie Streets",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 358 8911",
    website: "www.tshwane.gov.za",
    type: "local_authority"
  },
  {
    name: "Nelson Mandela Bay Metropolitan Municipality",
    address: "Uitenhage Road, Struandale",
    city: "Gqeberha",
    country: "South Africa",
    phone: "+27 41 506 1111",
    website: "www.nelsonmandelabay.gov.za",
    type: "local_authority"
  },
  {
    name: "Buffalo City Metropolitan Municipality",
    address: "Oxford Street, East London",
    city: "East London",
    country: "South Africa",
    phone: "+27 43 705 2000",
    website: "www.buffalocity.gov.za",
    type: "local_authority"
  },
  {
    name: "Ekurhuleni Metropolitan Municipality",
    address: "Cnr Cross & Roses Streets, Germiston",
    city: "Ekurhuleni",
    country: "South Africa",
    phone: "+27 11 999 0500",
    website: "www.ekurhuleni.gov.za",
    type: "local_authority"
  },
  {
    name: "Mangaung Metropolitan Municipality",
    address: "Bram Fischer Building, 44 Charlotte Maxeke Street",
    city: "Bloemfontein",
    country: "South Africa",
    phone: "+27 51 405 8911",
    website: "www.mangaung.co.za",
    type: "local_authority"
  },
  {
    name: "City of Polokwane",
    address: "Civic Centre, Landros Mare Street",
    city: "Polokwane",
    country: "South Africa",
    phone: "+27 15 290 2000",
    website: "www.polokwane.gov.za",
    type: "local_authority"
  },
  {
    name: "Mbombela Local Municipality",
    address: "1 Nel Street, Nelspruit",
    city: "Nelspruit",
    country: "South Africa",
    phone: "+27 13 759 9111",
    website: "www.mbombela.gov.za",
    type: "local_authority"
  },

  // UTILITIES & AGENCIES
  {
    name: "Rand Water",
    address: "Zuikerbosch, Vereeniging",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 682 0911",
    website: "www.randwater.co.za",
    type: "utility"
  },
  {
    name: "Eskom Holdings SOC",
    address: "Megawatt Park, Maxwell Drive, Sunninghill",
    city: "Johannesburg",
    country: "South Africa",
    tollfree: "0860 037 566",
    phone: "+27 11 800 8111",
    website: "www.eskom.co.za",
    type: "utility"
  },
  {
    name: "Airports Company South Africa",
    address: "28 Jones Road, Kempton Park",
    city: "Johannesburg",
    country: "South Africa",
    phone: "+27 11 723 1400",
    website: "www.acsa.co.za",
    type: "utility"
  },
  {
    name: "Transnet National Ports Authority",
    address: "2 Robinson Graving Dock Road, Point",
    city: "Durban",
    country: "South Africa",
    phone: "+27 31 365 7700",
    website: "www.transnet.net",
    type: "utility"
  },
  {
    name: "Road Traffic Management Corporation",
    address: "Eco Glades 2 Office Park, 420 Witch-Hazel Avenue",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 999 5200",
    website: "www.rtmc.co.za",
    type: "agency"
  },
  {
    name: "Electoral Commission of South Africa",
    address: "260 Walker Street, Sunnyside",
    city: "Pretoria",
    country: "South Africa",
    tollfree: "0800 11 8000",
    phone: "+27 12 622 5700",
    website: "www.elections.org.za",
    type: "agency"
  },
  {
    name: "Statistics South Africa",
    address: "Roper Street, Salvokop",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 310 8911",
    website: "www.statssa.gov.za",
    type: "agency"
  },
  {
    name: "Public Protector South Africa",
    address: "175 Lunnon Road, Hillcrest",
    city: "Pretoria",
    country: "South Africa",
    tollfree: "0800 11 2040",
    phone: "+27 12 366 7000",
    website: "www.pprotect.org",
    type: "agency"
  },
  {
    name: "South African Human Rights Commission",
    address: "29 Princess of Wales Terrace, Cnr York Road, Parktown",
    city: "Johannesburg",
    country: "South Africa",
    tollfree: "0800 21 2116",
    phone: "+27 11 877 3600",
    website: "www.sahrc.org.za",
    type: "agency"
  },
  {
    name: "Competition Commission South Africa",
    address: "Mulayo Building, c/r Meintjies & Eglin, Sunnyside",
    city: "Pretoria",
    country: "South Africa",
    phone: "+27 12 394 3200",
    website: "www.compcom.co.za",
    type: "agency"
  }
];
