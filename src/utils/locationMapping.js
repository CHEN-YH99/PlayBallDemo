// 位置映射配置 - 将GPS定位的地区映射到我们有数据的地区
export const locationMapping = {
  // 北京市地区映射
  '北京市': {
    // 有数据的地区
    supportedDistricts: ['朝阳区', '海淀区', '西城区', '东城区', '丰台区', '石景山区'],
    // 地区映射规则 - 将没有数据的地区映射到有数据的地区
    districtMapping: {
      '昌平区': '海淀区',
      '通州区': '朝阳区',
      '大兴区': '丰台区',
      '房山区': '丰台区',
      '顺义区': '朝阳区',
      '怀柔区': '朝阳区',
      '平谷区': '朝阳区',
      '密云区': '朝阳区',
      '延庆区': '海淀区'
    },
    // 默认地区（当无法映射时使用）
    defaultDistrict: '朝阳区'
  },
  
  // 上海市地区映射
  '上海市': {
    supportedDistricts: ['浦东新区', '黄浦区', '静安区'],
    districtMapping: {
      '徐汇区': '黄浦区',
      '长宁区': '静安区',
      '普陀区': '静安区',
      '虹口区': '静安区',
      '杨浦区': '静安区',
      '闵行区': '浦东新区',
      '宝山区': '浦东新区',
      '嘉定区': '浦东新区',
      '金山区': '浦东新区',
      '松江区': '浦东新区',
      '青浦区': '浦东新区',
      '奉贤区': '浦东新区',
      '崇明区': '浦东新区'
    },
    defaultDistrict: '浦东新区'
  },
  
  // 广州市地区映射
  '广州市': {
    supportedDistricts: ['天河区', '越秀区', '海珠区'],
    districtMapping: {
      '荔湾区': '越秀区',
      '白云区': '天河区',
      '黄埔区': '天河区',
      '番禺区': '海珠区',
      '花都区': '天河区',  // 花都区映射到天河区
      '南沙区': '海珠区',
      '从化区': '天河区',
      '增城区': '天河区'
    },
    defaultDistrict: '天河区'
  }
};

/**
 * 获取映射后的地区
 * @param {string} city 城市名称
 * @param {string} district 原始地区名称
 * @returns {object} { mappedDistrict: string, isOriginal: boolean, message?: string }
 */
export function getMappedDistrict(city, district) {
  const cityConfig = locationMapping[city];
  
  if (!cityConfig) {
    // 不支持的城市，返回原始地区
    return {
      mappedDistrict: district,
      isOriginal: true,
      message: `暂不支持${city}的数据`
    };
  }
  
  // 检查是否是支持的地区
  if (cityConfig.supportedDistricts.includes(district)) {
    return {
      mappedDistrict: district,
      isOriginal: true
    };
  }
  
  // 检查是否有映射规则
  if (cityConfig.districtMapping[district]) {
    return {
      mappedDistrict: cityConfig.districtMapping[district],
      isOriginal: false,
      message: `${district}暂无数据，为您显示${cityConfig.districtMapping[district]}的内容`
    };
  }
  
  // 使用默认地区
  return {
    mappedDistrict: cityConfig.defaultDistrict,
    isOriginal: false,
    message: `${district}暂无数据，为您显示${cityConfig.defaultDistrict}的内容`
  };
}

/**
 * 检查城市是否支持
 * @param {string} city 城市名称
 * @returns {boolean}
 */
export function isCitySupported(city) {
  return !!locationMapping[city];
}

/**
 * 获取支持的城市列表
 * @returns {string[]}
 */
export function getSupportedCities() {
  return Object.keys(locationMapping);
}