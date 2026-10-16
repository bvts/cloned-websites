export interface TourDate {
  when: string;
  city: string;
  venue: string;
  url?: string;
  past?: boolean;
}

export interface TourLeg {
  leg: string;
  rows: TourDate[];
}

export const TOUR_DATA: TourLeg[] = [
  {
    leg: "Europe",
    rows: [
      { when: "09.22.26", city: "Brussels, Belgium", venue: "Botanique — Museum", url: "https://botanique.be/concert/bleood-2026", past: true },
      { when: "09.23.26", city: "Amsterdam, Netherlands", venue: "Melkweg Oude Zaal", url: "https://www.ticketmaster.nl/event/1530445021?CL_ORIGIN=ORIGIN2&brand=nl_melkweg", past: true },
      { when: "09.25.26", city: "Cologne, Germany", venue: "Die Kantine", url: "https://www.livenation.de/bleood-tickets-adp1662662", past: true },
      { when: "09.27.26", city: "Paris, France", venue: "La Maroquinerie", url: "https://billetterie.aegpresents.fr/fr/manifestation/bleood-billet/idmanif/667119/codtypadh/FCM/numadh/01/codeconf/FTMS01", past: true },
      { when: "09.28.26", city: "London, UK", venue: "Outernet Live", url: "http://bio.to/Bleood", past: true },
      { when: "09.30.26", city: "Manchester, UK", venue: "Gorilla", url: "http://bio.to/Bleood", past: true },
      { when: "10.01.26", city: "Glasgow, UK", venue: "SWG3 Warehouse", url: "https://www.ticketweb.uk/event/bleood-tv-studio-swg3-tickets/14245894?pl=gigsinscotland", past: true },
      { when: "10.04.26", city: "Zurich, Switzerland", venue: "Dynamo", url: "https://www.ticketmaster.ch/artist/bleood-tickets/1493173?CL_ORIGIN=Origin08", past: true },
      { when: "10.05.26", city: "Munich, Germany", venue: "Technikum", url: "https://www.ticketmaster.de/artist/1493173?venueId=21053&subchannel_id=8", past: true },
      { when: "10.06.26", city: "Vienna, Austria", venue: "WUK", url: "https://www.ticketmaster.at/artist/1493173?venueId=531&subchannel_id=8", past: true },
      { when: "10.08.26", city: "Prague, Czech Republic", venue: "MeetFactory", url: "https://www.ticketmaster.cz/event/632012804?CL_ORIGIN=ORIGIN4", past: true },
      { when: "10.09.26", city: "Warsaw, Poland", venue: "Hybrydy", url: "https://sklep.ebilet.pl/adwv/254453378946433473", past: true },
      { when: "10.11.26", city: "Hamburg, Germany", venue: "Gruenspan", url: "https://www.ticketmaster.de/artist/1493173?venueId=20773&subchannel_id=8", past: true },
      { when: "10.12.26", city: "Berlin, Germany", venue: "Metropol", url: "https://www.ticketmaster.de/artist/1493173?venueId=30767&subchannel_id=8", past: true }
    ]
  },
  {
    leg: "North America",
    rows: [
      { when: "10.26.26", city: "Seattle, WA", venue: "Neumos", url: "https://www.axs.com/events/1579183/bleood-tickets?skin=neumos" },
      { when: "10.29.26", city: "San Francisco, CA", venue: "The Regency", url: "https://www.axs.com/events/1575409/bleood-tickets?skin=goldenvoice" },
      { when: "10.31.26", city: "Los Angeles, CA", venue: "The Fonda", url: "https://www.axs.com/events/1566103/bleood-tickets" },
      { when: "11.03.26", city: "Denver, CO", venue: "Cervantes Masterpiece Ballroom", url: "https://etix.com/ticket/p/71228115" },
      { when: "11.05.26", city: "Phoenix, AZ", venue: "The Nile (Mesa)", url: "https://tixr.com/e/203528" },
      { when: "11.07.26", city: "Salt Lake City, UT", venue: "The Grand at The Complex", url: "https://www.axs.com/events/1573663/bleood-tickets" },
      { when: "11.10.26", city: "Houston, TX", venue: "House of Blues", url: "https://www.ticketmaster.com/event/3A006512A5D68C3B" },
      { when: "11.11.26", city: "Oklahoma City, OK", venue: "Beer City Music Hall", url: "https://www.prekindle.com/promo/id/-2852527949052328030" },
      { when: "11.13.26", city: "Dallas, TX", venue: "Studio @ The Factory", url: "https://www.axs.com/events/1559300/bleood-tickets" },
      { when: "11.16.26", city: "Orlando, FL", venue: "The Beacham", url: "https://www.tkx.events/events/bleood-kill-your-idols-tour-2026-11-16" },
      { when: "11.17.26", city: "Tampa, FL", venue: "Jannus Live", url: "https://www.axs.com/events/1573985/bleood-tickets" },
      { when: "11.19.26", city: "Atlanta, GA", venue: "Center Stage", url: "https://www.ticketmaster.com/event/0E006511D2B11815" },
      { when: "11.21.26", city: "Charlotte, NC", venue: "The Underground", url: "https://www.ticketmaster.com/event/2D00651199D5847F" },
      { when: "11.23.26", city: "Columbus, OH", venue: "A&R Music Bar", url: "https://www.axs.com/events/1573982/bleood-tickets" },
      { when: "11.24.26", city: "Cleveland, OH", venue: "House of Blues", url: "https://www.ticketmaster.com/event/0500650FE8A2A7EB" },
      { when: "11.27.26", city: "Minneapolis, MN", venue: "Varsity Theater", url: "https://www.ticketmaster.com/event/06006512D2215D35" },
      { when: "11.28.26", city: "Milwaukee, WI", venue: "Rave Bar", url: "https://www.etix.com/ticket/p/71211525/bleood-kill-your-idols-tour-milwaukee-the-rave-eagles-club" },
      { when: "11.29.26", city: "Chicago, IL", venue: "Park West", url: "https://www.axs.com/events/1575405/bleood-kill-your-idols-tour-tickets" },
      { when: "12.01.26", city: "Toronto, ON", venue: "Phoenix Concert Theatre", url: "https://admitone.com/events/bleood-toronto-174557" },
      { when: "12.02.26", city: "Montreal, QC", venue: "Le Studio TD", url: "https://www.ticketmaster.ca/event/3100650E9C9D6174" },
      { when: "12.04.26", city: "Washington, DC", venue: "The Fillmore Silver Spring", url: "https://www.ticketmaster.com/event/15006511F94FCF81" },
      { when: "12.05.26", city: "Pittsburgh, PA", venue: "Mr. Smalls", url: "https://www.ticketweb.com/event/bleood-mr-smalls-theatre-tickets/15036923?theme=OpusOne&REFID=120526BMSARTIST" },
      { when: "12.06.26", city: "Philadelphia, PA", venue: "TLA", url: "https://www.ticketmaster.com/event/020065114237BE45" },
      { when: "12.09.26", city: "Boston, MA", venue: "The Sinclair", url: "https://www.axs.com/events/1570701/bleood-tickets?skin=sinclair" },
      { when: "12.10.26", city: "New York, NY", venue: "Irving Plaza", url: "https://www.ticketmaster.com/event/0000651113F46D2D" }
    ]
  }
];
