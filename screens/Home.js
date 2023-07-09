import React, { useState, useEffect } from "react";
import { StyleSheet, View, } from "react-native";
import MapView, { Marker, DraggableMarker } from "react-native-maps";
import MarkerModal from '../components/MarkerModal';
import {Picker} from '@react-native-picker/picker';
//import haversine from 'haversine';

const Home = () => {
    const [places, setPlaces] = useState([])
    const [placesTypes, setPlacesTypes] = useState([])
    const [modalVisible, setModalVisible] = useState(false);
    const [selectedMarker, setSelectedMarker] = useState(null);
    const [selectedType, setSelectedType] = useState(null);
    const [newMarker, setNewMarker] = useState(null);
    const [nearestPlace, setNearestPlace] = useState(null);
    
    useEffect(() => { 
        const getPlaces = async () => {
          try {
            const response = await fetch('https://gist.githubusercontent.com/saravanabalagi/541a511eb71c366e0bf3eecbee2dab0a/raw/bb1529d2e5b71fd06760cb030d6e15d6d56c34b3/places.json');
            const placesData = await response.json();
            console.log(placesData);
            setPlaces(placesData)    
          } 
          catch (error) {
            console.error(error);
          }
              
        }
        const getPlacesTypes = async () => {
          try {
            const response = await fetch('https://gist.githubusercontent.com/saravanabalagi/541a511eb71c366e0bf3eecbee2dab0a/raw/bb1529d2e5b71fd06760cb030d6e15d6d56c34b3/place_types.json');
            const placesTypesData = await response.json();
            console.log(placesTypesData);
            setPlacesTypes(placesTypesData) 
          } 
          catch (error) {
            console.error(error);
          }
          
        }
        getPlaces()
        getPlacesTypes()
      }, []);

      function GetAColor (id){
        switch (id) {
          case 1:
            return "navy";
          case 2:
            return "purple";
          case 3:
            return "green";
          case 4:
            return "yellow";
          case 5:
            return "linen";
          case 6:
            return "aqua";
          case 7:
            return "teal";
          case 8:
            return "violet";
          case 9:
            return "gold";
          case 10:
            return "indigo";
          case 11:
            return "orange";
          case 12:
            return "turquoise";
          case 13:
            return "plum";
          case 14:
            return "tomato";
          case 15:
            return "plum";
          default:
            return "wheat";
        }   
      }

      function getPhoto(url) {
        return url + '?random_number=' + new Date().getTime();
      }
      
      
      return (
        <View style={styles.container}>
        {/*Render our MapView*/}
            <MapView
                style={styles.map}
                //specify our coordinates.
                initialRegion={{
                latitude: 53.4494762,
                longitude: -7.8529786,
                latitudeDelta:5.3,
                longitudeDelta: 5.3,
                }}
                // onLongPress={(event) => {
                //   setNewMarker({
                //     coordinate: event.nativeEvent.coordinate,
                    
                //   });
                // }}
                onLongPress={(event) => {
                  setNewMarker({
                    coordinate: event.nativeEvent.coordinate,
                  });
                }}
                >
                {places
                  .filter((place) => !selectedType || place.place_type_id === selectedType)
                  .map((place) => (
                    <Marker
                        key={place.id}
                        coordinate={{latitude: place.latitude, longitude: place.longitude}}
                        title={place.name}
                        pinColor={GetAColor(place.place_type_id)}
                        onPress={() => {
                            setModalVisible(true);
                              setSelectedMarker({
                                title: place.name,
                                id: place.id,
                                gaelicName: place.gaelic_name!= null ? place.gaelic_name : "No Gaelic Name",
                                type: placesTypes.find(type => type.id === place.place_type_id).name,
                                latitude: place.latitude,
                                longitude: place.longitude,
                                image: getPhoto('https://picsum.photos/640/360'),
                                
                              })                           
                          }}
                        />
                ))}
                  {/* {newMarker && (
                    <DraggableMarker
                      coordinate={newMarker.coordinate}
                      onDragEnd={(event) => {
                      setNewMarker({
                        coordinate: event.nativeEvent.coordinate,
                      });
                      }}
                    />
                    )} */}
                {newMarker && (
                  <Marker
                    coordinate={newMarker.coordinate}
                    title="New Marker"
                  />
)}
            </MapView>
            <View style={{backgroundColor:'#ffff', margin: 20,}}>
                <Picker
                  selectedValue={selectedType}
                  style={{ height: 50, width: 150 }}
                  onValueChange={(itemValue, itemIndex) => setSelectedType(itemValue)}>
                  <Picker.Item label="All" value={null} />
                  {placesTypes.map((type) => (
                    <Picker.Item key={type.id} label={type.name} value={type.id} />
                  ))}
                </Picker>
            </View>            
             <View>
                <MarkerModal
                    visible={modalVisible}
                    marker = {selectedMarker!= null ? selectedMarker : {title: "No marker selected"}}
                    onClose={() => setModalVisible(false)}
                />
            </View>     
        </View>
      );
}

export default Home

const styles = StyleSheet.create({
    container: {
    ...StyleSheet.absoluteFillObject,
    flex: 1, //the container will fill the whole screen.
    justifyContent: "flex-end",
    alignItems: "center",
    },
    map: {
    ...StyleSheet.absoluteFillObject,
    },
});