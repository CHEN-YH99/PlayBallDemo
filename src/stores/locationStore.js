import { defineStore } from 'pinia';
import amapApi from '../utils/amapApi.js';
import { showToast } from 'vant';
import { getMappedDistrict } from '../utils/locationMapping.js';

export const useLocationStore = defineStore('location', {
  state: () => ({
    // 当前城市信息
    currentCity: '定位中...',
    isLocating: false,
    locationInitialized: false, // 标记是否已经初始化过定位

    // 位置详细信息
    locationDetails: {
      province: '',
      city: '',
      district: '',
      latitude: null,
      longitude: null,
      address: ''
    }
  }),

  getters: {
    // 获取显示用的城市名称
    displayCity: (state) => {
      return state.currentCity === '定位中...' ? '定位中...' : state.currentCity;
    },

    // 检查是否有有效的位置信息
    hasValidLocation: (state) => {
      return state.currentCity !== '定位中...' && state.currentCity !== '北京市';
    }
  },

  actions: {
    // 初始化位置信息（只在app启动时调用一次）
    async initializeLocation() {
      // 如果已经初始化过，直接返回
      if (this.locationInitialized) {
        return;
      }

      this.isLocating = true;

      try {
        await this.autoGetLocation();
        this.locationInitialized = true;
      } catch (error) {
        // 初始化位置失败
        this.currentCity = '北京市';
        this.locationInitialized = true;
      } finally {
        this.isLocating = false;
      }
    },

    // 自动获取定位
    async autoGetLocation() {
      // 检查浏览器是否支持地理定位
      if (navigator.geolocation) {
        return new Promise((resolve, reject) => {
          navigator.geolocation.getCurrentPosition(
            // 成功回调
            async (position) => {
              const { latitude, longitude } = position.coords;
              // GPS定位成功

              // 保存经纬度
              this.locationDetails.latitude = latitude;
              this.locationDetails.longitude = longitude;

              // 调用高德地图API进行逆地理编码
              try {
                await this.reverseGeocode(latitude, longitude);
                resolve();
              } catch (error) {
                await this.tryIPLocation();
                resolve();
              }
            },
            // 错误回调
            async (error) => {
              // GPS定位失败
              // GPS定位失败时尝试IP定位
              try {
                await this.tryIPLocation();
                resolve();
              } catch (ipError) {
                reject(ipError);
              }
            },
            // 选项
            {
              enableHighAccuracy: false,
              timeout: 5000,
              maximumAge: 600000, // 10分钟内的缓存位置可用
            }
          );
        });
      } else {
        // 浏览器不支持地理定位时尝试IP定位
        await this.tryIPLocation();
      }
    },

    // IP定位
    async tryIPLocation() {
      try {
        // 尝试IP定位
        const response = await amapApi.getLocationByIP();

        if (response.data.status === "1" && response.data.city) {
          let city = response.data.city;
          if (city && !city.endsWith("市") && !city.endsWith("区")) {
            city = city + "市";
          }

          this.currentCity = city;
          this.locationDetails.city = city;
          this.locationDetails.province = response.data.province || '';

          // IP定位成功
        } else {
          this.currentCity = "北京市";
          this.locationDetails.city = "北京市";
          this.locationDetails.province = "北京市";
        }
      } catch (error) {
        // IP定位失败
        this.currentCity = "北京市";
        this.locationDetails.city = "北京市";
        this.locationDetails.province = "北京市";
      }
    },

    // 逆地理编码，将经纬度转换为城市名称
    async reverseGeocode(latitude, longitude) {
      try {
        // 开始逆地理编码

        const response = await amapApi.reverseGeocode(longitude, latitude);
        // 逆地理编码响应

        if (
          response.data.status === "1" &&
          response.data.regeocode &&
          response.data.regeocode.addressComponent
        ) {
          // 获取地址组件
          const addressComponent = response.data.regeocode.addressComponent;
          let city = addressComponent.city || addressComponent.province || addressComponent.district;

          // 处理直辖市的情况
          if (!city && addressComponent.province) {
            city = addressComponent.province;
          }

          // 确保城市名称格式正确
          if (city) {
            if (!city.endsWith("市") && !city.endsWith("区") && !city.endsWith("县")) {
              city = city + "市";
            }

            this.currentCity = city;

            // 获取原始地区信息
            const originalDistrict = addressComponent.district || '';
            
            // 使用地区映射
            const mappingResult = getMappedDistrict(city, originalDistrict);
            
            // 保存详细位置信息
            this.locationDetails = {
              ...this.locationDetails,
              province: addressComponent.province || '',
              city: city,
              district: mappingResult.mappedDistrict,
              originalDistrict: originalDistrict, // 保存原始地区
              address: response.data.regeocode.formatted_address || ''
            };

            // 定位成功
            
            // 如果地区被映射了，显示提示信息
            if (!mappingResult.isOriginal && mappingResult.message) {
              // 地区映射
              showToast({
                message: mappingResult.message,
                type: "success",
                duration: 3000
              });
            }
          } else {
            throw new Error("无法获取城市信息");
          }
        } else {
          throw new Error(response.data.info || "逆地理编码失败");
        }
      } catch (error) {
        // 逆地理编码错误
        throw error;
      }
    },

    // 手动更新城市（用户手动选择时调用）
    updateCity(cityInfo) {
      this.currentCity = cityInfo.displayText || cityInfo.city;
      this.locationDetails = {
        ...this.locationDetails,
        province: cityInfo.province || '',
        city: cityInfo.city || cityInfo.displayText,
        district: cityInfo.district || '',
        address: cityInfo.fullAddress || ''
      };

      // 位置信息已更新

      showToast({
        message: `已选择：${cityInfo.fullAddress || cityInfo.displayText}`,
        type: "success",
      });
    },

    // 手动重新定位（用户点击定位按钮时调用）
    async manualLocation() {
      if (this.isLocating) return;

      this.isLocating = true;

      try {
        await this.autoGetLocation();
        showToast({
          message: `定位成功：${this.currentCity}`,
          type: "success",
        });
      } catch (error) {
        showToast({
          message: "定位失败，请手动选择城市",
          type: "fail",
        });
      } finally {
        this.isLocating = false;
      }
    },

    // 获取定位错误信息
    getPositionErrorMessage(error) {
      switch (error.code) {
        case error.PERMISSION_DENIED:
          return "用户拒绝了地理定位请求";
        case error.POSITION_UNAVAILABLE:
          return "位置信息不可用";
        case error.TIMEOUT:
          return "获取用户位置超时";
        case error.UNKNOWN_ERROR:
          return "发生未知错误";
        default:
          return "定位失败";
      }
    }
  }
});