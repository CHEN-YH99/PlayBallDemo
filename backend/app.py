from flask import Flask, request, jsonify
from flask_cors import CORS
import json
import os

app = Flask(__name__)
CORS(app)  # 允许跨域请求

# 设置JSON编码，确保中文正确显示
app.config['JSON_AS_ASCII'] = False

def load_data():
    """加载JSON数据文件"""
    try:
        # 获取数据文件路径
        data_path = os.path.join(os.path.dirname(__file__), '..', 'public', 'data.json')
        with open(data_path, 'r', encoding='utf-8') as f:
            return json.load(f)
    except FileNotFoundError:
        return {"players": [], "activities": []}
    except json.JSONDecodeError:
        return {"players": [], "activities": []}

def filter_by_location(items, city, district=None):
    """根据城市和地区过滤数据"""
    filtered_items = []
    
    for item in items:
        # 检查城市匹配
        if item.get('city') == city:
            # 如果指定了地区，则需要地区也匹配
            if district:
                if item.get('district') == district:
                    filtered_items.append(item)
            else:
                # 如果没有指定地区，则只要城市匹配即可
                filtered_items.append(item)
    
    return filtered_items

@app.route('/api/nearby', methods=['GET'])
def get_nearby_data():
    """获取附近的球友和活动数据"""
    try:
        # 获取请求参数
        city = request.args.get('city')
        district = request.args.get('district')
        
        if not city:
            return jsonify({
                'success': False,
                'message': '城市参数不能为空'
            }), 400
        
        # 加载数据
        data = load_data()
        
        # 过滤球友数据
        filtered_players = filter_by_location(data.get('players', []), city, district)
        
        # 过滤活动数据
        filtered_activities = filter_by_location(data.get('activities', []), city, district)
        
        return jsonify({
            'success': True,
            'data': {
                'players': filtered_players,
                'activities': filtered_activities,
                'total_players': len(filtered_players),
                'total_activities': len(filtered_activities)
            },
            'filters': {
                'city': city,
                'district': district
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'服务器错误: {str(e)}'
        }), 500

@app.route('/api/nearby_players', methods=['GET'])
def get_nearby_players():
    """单独获取附近球友数据"""
    try:
        city = request.args.get('city')
        district = request.args.get('district')
        
        if not city:
            return jsonify({
                'success': False,
                'message': '城市参数不能为空'
            }), 400
        
        data = load_data()
        filtered_players = filter_by_location(data.get('players', []), city, district)
        
        return jsonify({
            'success': True,
            'data': filtered_players,
            'total': len(filtered_players),
            'filters': {
                'city': city,
                'district': district
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'服务器错误: {str(e)}'
        }), 500

@app.route('/api/activities', methods=['GET'])
def get_activities():
    """单独获取活动数据"""
    try:
        city = request.args.get('city')
        district = request.args.get('district')
        
        if not city:
            return jsonify({
                'success': False,
                'message': '城市参数不能为空'
            }), 400
        
        data = load_data()
        filtered_activities = filter_by_location(data.get('activities', []), city, district)
        
        return jsonify({
            'success': True,
            'data': filtered_activities,
            'total': len(filtered_activities),
            'filters': {
                'city': city,
                'district': district
            }
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'服务器错误: {str(e)}'
        }), 500

@app.route('/api/cities', methods=['GET'])
def get_cities():
    """获取所有可用的城市和地区列表"""
    try:
        data = load_data()
        cities = {}
        
        # 从球友和活动数据中提取城市和地区信息
        all_items = data.get('players', []) + data.get('activities', [])
        
        for item in all_items:
            city = item.get('city')
            district = item.get('district')
            
            if city:
                if city not in cities:
                    cities[city] = set()
                if district:
                    cities[city].add(district)
        
        # 转换set为list以便JSON序列化
        cities_list = {city: list(districts) for city, districts in cities.items()}
        
        return jsonify({
            'success': True,
            'data': cities_list
        })
        
    except Exception as e:
        return jsonify({
            'success': False,
            'message': f'服务器错误: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)