export class User {
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

export class Country {
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
    this.id = id ?? '';
    this.name = name ?? '';
    this.abbreviation = abbreviation ?? '';
  }
 }

export class Province {
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

export class City {
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

export class Band {
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

export class BandMembership {
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

export class Genre {
  id: string;
  name: string;

  constructor({ id, name }: Partial<{ id: string; name: string }>) {
    this.id = id ?? '';
    this.name = name ?? '';
  }
}