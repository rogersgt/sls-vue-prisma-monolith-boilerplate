export class BaseEntityClass {}

export class User extends BaseEntityClass {
  id: string;
  firstName: string;
  lastName: string;
  pictureUrl: string;
  email: string;
  emailVerified: boolean;
  googleUserId: string;
  bandMemberships: BandMembership[];
  
  constructor({
    id,
    firstName,
    lastName,
    pictureUrl,
    email,
    emailVerified,
    googleUserId,
    bandMemberships = []
  }: Partial<{
    id: string;
    firstName: string;
    lastName: string;
    pictureUrl: string;
    email: string;
    emailVerified: boolean;
    googleUserId: string;
    bandMemberships: Partial<BandMembership>[];
  }>) {
    super();
    this.id = id ?? '';
    this.email = email ?? '';
    this.firstName = firstName ?? '';
    this.lastName = lastName ?? '';
    this.pictureUrl = pictureUrl ?? '';
    this.emailVerified = emailVerified ?? false;
    this.googleUserId = googleUserId ?? '';
    this.bandMemberships = bandMemberships.map((membership) => new BandMembership(membership))
  }
}

export class Country extends BaseEntityClass {
  id: string;
  name: string;
  abbreviation: string;

  constructor({
    id,
    name,
    abbreviation
  }: Partial<{
    id: string;
    name: string;
    abbreviation: string;
  }>) {
    super();
    this.id = id ?? '';
    this.name = name ?? '';
    this.abbreviation = abbreviation ?? '';
  }
 }

export class Province extends BaseEntityClass {
  id: string;
  name: string;
  abbreviation: string;
  countryId: string;
  country?: Country;

  constructor({
    id,
    name,
    abbreviation,
    country,
    countryId
  }: Partial<{ id: string; name: string; abbreviation: string; countryId: string; country: Partial<Country> }>) {
    super();
    this.id = id ?? '';
    this.name = name ?? '';
    this.abbreviation = abbreviation ?? '';
    this.countryId = countryId ?? '';
    this.country = new Country({
      ...country,
      id: country?.id ?? countryId ?? ''
    })
  }
}

export class City extends BaseEntityClass {
  id: string;
  name: string;
  abbreviation: string;
  provinceId: string;
  province: Province;
  constructor({
    id,
    name,
    abbreviation,
    provinceId,
    province
  }: Partial<{
    id: string;
    name: string;
    abbreviation: string;
    provinceId: string;
    province: Partial<Province>;
  }>) {
    super();
    this.id = id ?? '';
    this.name = name ?? '';
    this.abbreviation = abbreviation ?? '';
    this.provinceId = provinceId ?? '';
    this.province = new Province({
      ...province,
      id: province?.id ?? provinceId ?? '',
    })
  }
}

export class Band extends BaseEntityClass {
  id: string;
  name: string;
  cityId: string;
  city: City;
  genres: Genre[];
  instagramHandle?: string;
  websiteUrl?: string;
  founded?: Date;
  spotifyArtistId?: string;
  bandMemberShips: BandMembership[];
  

  constructor({
    id,
    name,
    cityId,
    city,
    genres = [],
    founded,
    websiteUrl,
    instagramHandle,
    spotifyArtistId,
    bandMemberships = []
  }: Partial<{
    id: string;
    name: string;
    cityId: string;
    city: Partial<City>;
    genres: Partial<Genre>[];
    instagramHandle: string;
    websiteUrl: string;
    founded: Date;
    spotifyArtistId: string;
    bandMemberships: BandMembership[];
  }>) {
    super();
    this.id = id ?? '';
    this.name = name ?? '';
    this.cityId = cityId ?? ''; 
    this.city = new City({
      ...city,
      id: city?.id || cityId,
      province: new Province({
        ...city?.province,
        id: city?.provinceId ?? ''
      })
    });
    this.genres = genres.map((g) => new Genre({ ...g }));
    this.founded = founded;
    this.websiteUrl = websiteUrl;
    this.instagramHandle = instagramHandle;
    this.spotifyArtistId = spotifyArtistId ?? '';
    this.bandMemberShips = bandMemberships.map((membership) => new BandMembership({ ...membership }));
  }
}

export type BandMembershipRole = 'owner' | 'member';

export class BandMembership extends BaseEntityClass {
  id: string;
  bandId: string;
  band?: Band;
  userId: string;
  user?: User;
  role: BandMembershipRole;

  constructor({
    id,
    band,
    userId,
    bandId,
    user,
    role
  }: Partial<{ id: string; bandId: string; band: Partial<Band>; userId: string; user: Partial<User>; role: BandMembershipRole }>) {
    super();
    this.id = id ?? '';
    this.bandId = bandId ?? '';
    this.userId = userId ?? '';
    this.band = new Band({
      ...band,
      id: band?.id ?? bandId ?? ''
    });
    this.user = new User({
      ...user,
      id: user?.id ?? userId ?? ''
    });
    this.role = role ?? 'member';
  }
}

export class Genre extends BaseEntityClass {
  id: string;
  name: string;

  constructor({ id, name }: Partial<{ id: string; name: string }>) {
    super();
    this.id = id ?? '';
    this.name = name ?? '';
  }
}

export class BandShow {
  id: string;
  bandId: string;
  band?: Band;
  showId: string;
  show?: Show;

  constructor({
    id,
    bandId,
    showId,
    band,
    show
  }: {
    id?: string;
    bandId?: string;
    showId?: string;
    band?: Band;
    show?: Show;
  }) {
    this.id = id ?? '';
    this.bandId = bandId ?? '';
    this.showId = showId ?? '';
    this.band = band;
    this.show = show;
  }
}

export class Show {
  id: string;
  eventName: string;
  date: Date;
  doorsOpenAt?: Date;
  bandsPlaying: BandShow[];

  constructor({
    id,
    eventName,
    date,
    doorsOpenAt,
    bandsPlaying
  }: {
    id?: string;
    eventName?: string;
    date?: Date;
    doorsOpenAt?: Date;
    bandsPlaying?: BandShow[];
  }) {
    this.id = id ?? '';
    this.eventName = eventName ?? '';
    this.date = date ?? new Date();
    this.doorsOpenAt = doorsOpenAt;
    this.bandsPlaying = bandsPlaying?.map((bandShow) => new BandShow(bandShow)) ?? [];
  }
}
