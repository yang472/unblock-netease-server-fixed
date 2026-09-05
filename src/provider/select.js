const normalize = (text) =>
	(text || '')
		.toLowerCase()
		.replace(/[（(][^）)]*[）)]/g, ' ')
		.replace(/[^\p{L}\p{N}]/gu, '')
		.trim();

const getArtists = (song) => {
	const artists = song.artists;
	if (Array.isArray(artists)) {
		return artists
			.map((artist) => artist && artist.name)
			.filter(Boolean);
	}
	if (song.singername) {
		return song.singername
			.split(/[、,&]/)
			.map((name) => name.trim())
			.filter(Boolean);
	}
	return [];
};

const hasVariantSuffix = (song) => {
	const tail =
		[
			song.name,
			song.filename,
			song.songname,
			song.songname_suffix,
			song.trans_param && song.trans_param.songname_suffix,
			song.album && song.album.name,
		]
			.filter(Boolean)
			.join(' ') || '';

	return /(dj|remix|cover|翻唱|live|现场|伴奏|纯音乐|instrumental|acoustic|弹唱|对唱|合唱|demo|改编|电音|混音|串烧|清唱|试听|片段|铃声|加快|慢速|降调|升调|变速|男声|女声|remaster|rework|bootleg|extended|preview|short)/i.test(
		tail
	);
};

const isExplicitCover = (song) =>
	song.isoriginal === 0 ||
	(song.trans_param && song.trans_param.is_original === 0) ||
	false;

const matchesTitle = (song, info) => {
	const expected = normalize(info.name);
	if (!expected) return true;
	const actual = [
		normalize(song.name),
		normalize(song.songname),
		normalize(song.songname_original),
	].filter(Boolean);
	return actual.some(
		(actual) =>
			actual === expected ||
			actual.includes(expected) ||
			expected.includes(actual)
	);
};

const scoreSong = (song, info) => {
	let score = 0;

	if (song.isoriginal === 1 || (song.trans_param && song.trans_param.is_original === 1)) {
		score += 35;
	}
	if (song.isoriginal === 0) {
		score -= 12;
	}
	if (hasVariantSuffix(song)) {
		score -= 50;
	}

	const expectedArtists = (info.artists || [])
		.map((artist) => normalize(artist.name))
		.filter(Boolean);
	const actualArtists = getArtists(song).map(normalize).filter(Boolean);
	if (expectedArtists.length && actualArtists.length) {
		const matched = expectedArtists.some((expected) =>
			actualArtists.some(
				(actual) => actual.includes(expected) || expected.includes(actual)
			)
		);
		score += matched ? 30 : -30;
	}

	const expectedName = normalize(info.name);
	const actualNames = [
		normalize(song.name),
		normalize(song.songname),
		normalize(song.songname_original),
	].filter(Boolean);
	if (expectedName && actualNames.length) {
		if (actualNames.includes(expectedName)) {
			score += 25;
		} else if (
			actualNames.some(
				(actual) => actual.includes(expectedName) || expectedName.includes(actual)
			)
		) {
			score += 12;
		} else {
			score -= 20;
		}
	}

	if (info.album && info.album.name && song.album && song.album.name) {
		if (
			normalize(info.album.name) === normalize(song.album.name)
		) {
			score += 18;
		}
	}

	if (info.duration && song.duration) {
		const diff = Math.abs(song.duration - info.duration);
		if (diff < 2 * 1e3) {
			score += 20;
		} else if (diff < 5 * 1e3) {
			score += 10;
		} else {
			score -= 25;
		}
	}

	return score;
};

const rank = (list, info) =>
	list
		.map((song) => ({
			song,
			score: scoreSong(song, info),
		}))
		.sort((a, b) => b.score - a.score)
		.map((item) => item.song);

module.exports = (list, info) => rank(list, info)[0];

module.exports.rank = rank;
module.exports.hasVariantSuffix = hasVariantSuffix;
module.exports.isExplicitCover = isExplicitCover;
module.exports.matchesTitle = matchesTitle;

module.exports.ENABLE_FLAC =
	(process.env.ENABLE_FLAC || '').toLowerCase() === 'true';
