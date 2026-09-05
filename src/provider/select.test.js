const select = require('./select');

describe('select', () => {
	const info = {
		name: '海阔天空',
		artists: [{ id: 1, name: 'Beyond' }],
		album: { id: 1, name: '海阔天空' },
		duration: 246000,
	};

	const song = (overrides) => ({
		id: 'hash',
		name: info.name,
		songname: info.name,
		songname_original: info.name,
		filename: info.name,
		artists: [{ id: null, name: 'Beyond' }],
		album: { id: 1, name: info.album.name },
		duration: info.duration,
		...overrides,
	});

	test('hasVariantSuffix() flags DJ, cover, live and preview variants', () => {
		expect(
			select.hasVariantSuffix(song({ name: `${info.name} (DJ版)` }))
		).toBe(true);
		expect(
			select.hasVariantSuffix(song({ name: `${info.name}（翻唱）` }))
		).toBe(true);
		expect(
			select.hasVariantSuffix(song({ name: `${info.name} Live` }))
		).toBe(true);
		expect(
			select.hasVariantSuffix(song({ name: `${info.name} 试听片段` }))
		).toBe(true);
	});

	test('hasVariantSuffix() does not flag a plain original title', () => {
		expect(select.hasVariantSuffix(song())).toBe(false);
		expect(select.hasVariantSuffix(song({ name: `${info.name} 原版` }))).toBe(
			false
		);
	});

	test('isExplicitCover() recognizes Kugou cover markers', () => {
		expect(select.isExplicitCover(song({ isoriginal: 0 }))).toBe(true);
		expect(
			select.isExplicitCover(
				song({ trans_param: { is_original: 0 } })
			)
		).toBe(true);
		expect(select.isExplicitCover(song({ isoriginal: 1 }))).toBe(false);
	});

	test('rank() puts the original above DJ and cover candidates', () => {
		const ranked = select.rank(
			[
				song({
					id: 'dj',
					name: `${info.name} (DJ版)`,
					songname: `${info.name} (DJ版)`,
					songname_original: `${info.name} (DJ版)`,
				}),
				song({ id: 'original', isoriginal: 1 }),
				song({
					id: 'cover',
					name: `${info.name}（翻唱）`,
					songname: `${info.name}（翻唱）`,
					songname_original: `${info.name}（翻唱）`,
					isoriginal: 0,
				}),
			],
			info
		);

		expect(ranked[0].id).toBe('original');
	});
});
