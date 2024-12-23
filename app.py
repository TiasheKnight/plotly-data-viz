from flask import Flask, render_template, send_from_directory
import os

# Initialize Flask app
app = Flask(__name__)

# Define base directory for visualizations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VISUALIZATIONS = {
    "Line chart": "line_chart.html",
    "Pie chart": "pie_chart.html",
    "Box plot": "box_plot.html",
    "Scatter plot": "scatter_plot.html",
    "World map": "world_map.html",
    "Taiwan map": "taiwan_map.html",
    "Bargraph": "bargraph.html",
}

# Route for home page
@app.route('/')
def home():
    cards = "".join(f"""
        <div class='col-md-12 mb-4'>
            <div class='card' style='min-height: 100px; display: flex; justify-content: center; position: relative;'>
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
                padding: 20px;
                height:100vh;
                overflow:auto;
            }}
            .container-fluid {{
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
                overflow: visible;
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
                justify-content: center;
                align-items: center;
            }}
        </style>
    </head>
    <body>
        <div class='container-fluid'>
            <h1 class='text-center text-primary mb-4'>Data Visualization App</h1>
            <div class='row'>
                <div class='col-md-4'>
                    <div class='row'>
                        {cards}
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

# Run the app
if __name__ == '__main__':
    app.run(debug=True)
