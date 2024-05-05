import pandas as pd
import json



def dfToGeoJson(df, propCols, lat="LAT", lon="LON"):
    geojson = {'type': 'FeatureCollection', 'features': []}
    
    for _, row in df.iterrows():
        feature = {
            'type': 'Feature',
            'geometry': {
                'type': 'Point',
                'coordinates': [row[lon], row[lat]]
            },
            'properties': {
                prop: row[prop] for prop in propCols
            },
        }
        
        geojson['features'].append(feature)
    return geojson




if __name__ == "__main__":
    fPath = "data/katrinaTrack.csv"
    df = pd.read_csv(fPath)
    propCols = [
        'ISO_TIME',
        'NAME',
        'LAT',
        'LON',
        'USA_SSHS',
        'USA_WIND',
        'USA_RMW',
        'USA_STATUS',
        'SEASON',
        'NUMBER',
        'SID',
    ]
    
    geojsonFPath = fPath[:-4] + ".geojson"
    geojsonData = dfToGeoJson(df, propCols)
    
    with open(geojsonFPath, "w") as f:
        json.dump(geojsonData, f, indent=4)