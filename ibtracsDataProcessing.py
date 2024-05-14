import pandas as pd

df = pd.read_csv('RawData/ibtracs.NA.list.v04r00.csv', skiprows=[1])
columnsToKeep = [
    'ISO_TIME',
    'SID',
    'NAME',
    'LAT',
    'LON',
    'USA_SSHS',
    'USA_RMW',
    'USA_WIND',
    'USA_STATUS',
    'SEASON',
    'NUMBER',
    # 'BASIN',
    # 'SUBBASIN',
    # 'NATURE',
    # 'WMO_WIND',
    # 'WMO_PRES',
    # 'WMO_AGENCY',
    # 'TRACK_TYPE',
    # 'DIST2LAND',
    # 'LANDFALL',
    # 'IFLAG',
    # 'USA_AGENCY',
    # 'USA_ATCF_ID',
    # 'USA_LAT',
    # 'USA_LON',
    # 'USA_RECORD',
]
df = df[columnsToKeep]
# df.sort_values(by=['ISO_TIME'])
katrinaDf = df[df['SID'] == "2005236N23285"].copy()
katrinaDf['USA_WIND'] = katrinaDf['USA_WIND'] * 1.15078
katrinaDf['USA_WIND'] = katrinaDf['USA_WIND'].round(0).astype(int)
katrinaDf.sort_values(by=['ISO_TIME'], inplace=True)
katrinaDf.to_csv('./data/katrinaTrack.csv', index=False)