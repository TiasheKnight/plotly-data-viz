from flask import Flask, render_template, send_from_directory, request, jsonify
import os

# Initialize Flask app
app = Flask(__name__)

# Define base directory for visualizations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VISUALIZATIONS = {
    "Bar Chart": "bar_chart.html",
    "Box Plot": "box_plot.html",
    "Histogram": "histogram.html",
    "Pie Chart": "pie_chart.html",
    "Scatter Plot": "scatter_plot.html",
    "Taiwan Map": "taiwan_map.html",
    "World Map": "world_map.html",
}


@app.route('/')
def home():
    return render_template('dashboard.html')


@app.route('/dashboard')
def dashboard():
    return render_template('dashboard.html')


# Route for home page
@app.route('/chart')
def chart():
    cards = "".join(f"""
        <div class='col-md-12 mt-3'>
            <div class='card' style='min-height: 70px; display: flex; justify-content: center; position: relative;'>
                <div class='card-body'>
                    <h5 class='card-title text-center'>{name}</h5>
                    <button class='btn btn-primary' style="position: absolute; right: 10px; top: 50%; transform: translateY(-50%);" onclick="loadGraph('{name}')">View</button>
                </div>
            </div>
        </div>
    """ for name in VISUALIZATIONS.keys())

    return f"""
    <!DOCTYPE html>
    <html lang='en'>
    <head>
        <meta charset='UTF-8'>
        <meta name='viewport' content='width=device-width, initial-scale=1.0'>
        <title>Data Visualization App</title>
        <link href='https://cdn.jsdelivr.net/npm/bootstrap@5.3.0-alpha3/dist/css/bootstrap.min.css' rel='stylesheet'>
        <style>
            body {{
                background-color: #f8f9fa;
                height:95vh;
                overflow:none;
            }}
            .navbar {{
                position: sticky;
                top: 0;
                z-index: 1000;
            }}
            .container {{
                padding:20px;
                max-width: 1200px;
                margin: 0 auto;
            }}
            .graph-container {{
                border: 2px solid #003366;
                display: flex;
                justify-content: center;
                align-items: center;
                border-radius: 10px;
                padding: 20px;
                background: #ffffff;
                box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
                margin-top: 20px;
                min-height: 500px;
                height: 800px;
                overflow: none;
                flex: 1;
            }}
            .row {{
                display: flex;
            }}
            .col-md-4 {{
                flex: 0 0 20%; /* Take up 20% width */
            }}
            .col-md-8 {{
                flex: 1; /* Take up the remaining space */
            }}
            .card {{
                width: 100%;
                position: relative;
            }}
            .card-body {{
                display: flex;
                width:300px;
                height:50px;
                justify-content: center;
                align-items: center;
            }}
            footer {{
                text-align: center;
                padding: 10px;
                background-color: #343a40;
                color: white;
                position: fixed;
                width: 100%;
                bottom: 0;
                height: 40px;
            }}
        </style>
    </head>
    <body>
        <nav class="navbar navbar-expand-lg navbar-dark bg-dark">
        <div class="container-fluid">
            <a class="navbar-brand" href="/chart">Chart View</a>
            <button
            class="navbar-toggler"
            type="button"
            data-bs-toggle="collapse"
            data-bs-target="#navbarNav"
            aria-controls="navbarNav"
            aria-expanded="false"
            aria-label="Toggle navigation"
            >
            <span class="navbar-toggler-icon"></span>
            </button>
            <div class="collapse navbar-collapse" id="navbarNav">
            <ul class="navbar-nav ms-auto">
                <li class="nav-item">
                <a class="nav-link" href="/dashboard">Dashboard</a>
                </li>
                <li class="nav-item">
                <a class="nav-link active" href="/chart">Chart View</a>
                </li>
                <li class="nav-item">
                <a class="nav-link" href="/taiwan">Taiwan</a>
                </li>
            </ul>
            </div>
        </div>
        </nav>              
        <div class='container'>
            <h1 class='text-center mb-4'>Chart View</h1>
            <div class='row'>
                <div class='col-md-4 mb-5' style='height:90vh;'>
                    <div class='row'>
                        {cards}
                        <br>  
                    </div>
                </div>
                <div class='col-md-8'>
                    <div id='graphContainer' class='graph-container' style='display: none;'>
                        <h4 class='text-center text-secondary'>Visualization</h4>
                        <div id='graphContent'></div>
                    </div>
                </div>
            </div>
        </div>
        <footer>
            <p>Data Visualization Team 7</p>
        </footer>
        <script>
            function loadGraph(name) {{
                const graphContainer = document.getElementById('graphContainer');
                const graphContent = document.getElementById('graphContent');
                graphContent.innerHTML = `<iframe src='/visualization/${{name}}' style='width: 800px; height: 600px; overflow:visible; display: block; border: none;'></iframe>`;
                graphContainer.style.display = 'block';
            }}
        </script>
    </body>
    </html>
    """


# Dynamic route for visualizations
@app.route('/visualization/<name>')
def visualization(name):
    if name in VISUALIZATIONS:
        folder_path = os.path.join(BASE_DIR, 'templates')
        with open(os.path.join(folder_path, VISUALIZATIONS[name])) as f:
            return f.read()
    else:
        return "Visualization not found", 404


@app.route('/country-click', methods=['POST'])
def country_click():
    country_name = request.json.get('country', None)
    if country_name:
        # Handle the logic for the clicked country here
        return jsonify({'message': f'{country_name} was clicked!'})
    else:
        return jsonify({'error': 'No country provided'}), 400


@app.route('/histogram')
def histogram():
    return render_template('histogram.html')


@app.route('/box_plot')
def box_plot():
    return render_template('box_plot.html')


@app.route('/bar_chart')
def bar_chart():
    return render_template('bar_chart.html')


@app.route('/pie_chart')
def pie_chart():
    return render_template('pie_chart.html')


@app.route('/scatter_plot')
def scatter_plot():
    return render_template('scatter_plot.html')


@app.route('/taiwan_map')
def taiwan_map():
    return render_template('taiwan_map.html')


@app.route('/world_map')
def world_map():
    return render_template('world_map.html')


@app.route('/taiwan')
def taiwan():
    return render_template('taiwan.html')


@app.route('/point-click', methods=['POST'])
def point_click():
    data = request.json
    x = data.get('x')
    y = data.get('y')
    return jsonify({'message': f'Point clicked at x: {x}, y: {y}'})


# Run the app
if __name__ == '__main__':
    app.run(debug=False, host='0.0.0.0', port=80)
