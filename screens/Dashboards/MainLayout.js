import React from 'react'
import {
    View, 
    Text,
    TouchableOpacity,
    Image,
    Animated

} from 'react-native';
import { Shadow }from 'react-native-shadow-2'

import {Home, Search, Profile} from '../'
import {COLORS, SIZES, FONTS, constants} from '../../constants'



const bottom_tabs = constants.bottom_tabs.map(tab=>({
    ...tab,
    ref: React.createRef()
}))

const TabIndicator = ({measureLayout, scrollX})=>{

    const inputRange = bottom_tabs.map((_, i)=> i * SIZES.width)
    console.log('range', measureLayout)


    const tabIndicatorWidth = scrollX.interpolate({
        inputRange,
        outputRange: measureLayout.map(measure=> measure.width)
    })

    const translateX = scrollX.interpolate({
        inputRange,
        outputRange: measureLayout.map(measure=> measure.x)
    })
    console.log('tabIndicatoWidth', tabIndicatorWidth)
    
    React.useEffect(()=>{
        console.log('translatex', translateX)
    }, [translateX])


    return (
        <Animated.View 
            style={{
                position:'absolute',
                left: 0,
                height: '100%',
                width: tabIndicatorWidth,
                borderRadius: SIZES.radius,
                backgroundColor: COLORS.primary,
                transform: [{translateX}]

            }}
        />
    )
}

const Tabs = ({scrollX})=>{
    const containerRef = React.useRef()
    const [measureLayout, setMeasureLayout] = React.useState([])

    React.useEffect(()=>{
        let ml = []
        bottom_tabs.forEach((tab)=>{
            tab?.ref?.current?.measureLayout(
                containerRef.current, (x, y, width, height)=>{
                    console.log('x', x)
                    console.log('y', y)
                    ml.push({x, y, width, height})

                    if(ml.length === bottom_tabs.length){
                        setMeasureLayout(ml)
                    }
                }
            )
        })

    }, [containerRef.current])
    
    return (
        <View
            ref={containerRef}
            style={{
                flexDirection: 'row',
                flex: 1
            }}
        >
            {measureLayout.length > 0 && <TabIndicator 
             measureLayout={measureLayout} scrollX={scrollX} />}
            {bottom_tabs.map((item, index)=>(
                <TouchableOpacity
                    key={`BottomTab-${index}`}
                    ref={item.ref}
                    style={{
                        flex: 1,
                        paddingHorizontal: 15,
                        alignItems: 'center',
                        justifyContent: 'center'
                    }}
                >
                    <Image 
                        source={item.icon}
                        resizeMode='contain'
                        style={{
                            width: 25,
                            height: 25
                        }}
                    />
                    <Text
                        style={{
                            marginTop: 3,
                            color: COLORS.white,
                            ...FONTS.h3
                        }}
                    >
                        {item.label}
                    </Text>
                </TouchableOpacity>
            ))}
        
        </View>
    )
}

const MainLayout = () => {
    const flatListRef = React.useRef()
    const scrollX = React.useRef(new Animated.Value(0)).current

    const renderContent = ()=>{
        return (
            <View
                style={{
                    flex: 1,
                    backgroundColor: 'red'
                }}
            >
                <Animated.FlatList
                    ref={flatListRef}
                    horizontal
                    pagingEnabled
                    snapToAlignment='center'
                    snapToInterval={SIZES.width}
                    decelerationRate='fast'
                    showsHorizontalScrollIndicator={false}
                    data={constants.bottom_tabs}
                    keyExtractor={(item)=>`Main-${item.id}`}
                    onScroll={Animated.event([
                        {nativeEvent: {contentOffset: {x: scrollX} }}
                    ],
                    {useNativeDriver: false}
                    )}
                    renderItem={({item, index})=>(
                        <View
                            style={{
                                height: SIZES.height,
                                width: SIZES.width
                            }}
                        >
                            {item.label == constants.screens.home && <Home />}
                            {item.label == constants.screens.search && <Search />}
                            {item.label == constants.screens.profile && <Profile />}
                        </View>
                    )}

                />
            </View>
        )
    }

    const renderBottomTabs = ()=>{
        return (
            <View
                style={{
                    marginBottom: 20,
                    paddingHorizontal: SIZES.padding,
                    paddingVertical: SIZES.radius,
                }}
            >
                <Shadow
                    size={[SIZES.width - (SIZES.padding * 2), 85]}
                >
                <View
                    style={{flex: 1, borderRadius: SIZES.radius, backgroundColor: COLORS.primary3 }}
                >
                    <Tabs 
                        scrollX={scrollX}
                    />
                </View>
                </Shadow>
            </View>
        )
    }
  return (
    <View
        style={{
            flex: 1,
            backgroundColor: COLORS.white
        }}
    >
        {/** Content */}
        {renderContent()}

        {/* Bottom Tabs */}
        {renderBottomTabs()}
    </View>
  )
}

export default MainLayout