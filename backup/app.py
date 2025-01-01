from flask import Flask, render_template, send_from_directory
import os

# Initialize Flask app
app = Flask(__name__)

# Define base directory for visualizations
BASE_DIR = os.path.dirname(os.path.abspath(__file__))
VISUALIZATIONS = {
    "Bar_chart": "bar_chart.html",
    "Pie chart": "pie_chart.html",
    "Box plot": "box_plot.html",
    "Umbrella point map": "umbrella_point_map.html",
    "World map": "world_map.html",
    "Taiwan map": "taiwan_map.html",
    "Value matrix": "value_matrix.html",
}

# Route for home page
@app.route('/')
def home():
    cards = "".join(f"""
        <div class='col-md-4 mb-4'>
            <div class='card'>
                <div class='card-body'>
                    <h5 class='card-title text-center'>{name}</h5>
                    <a href='/visualization/{name}' class='btn btn-primary d-block mt-3'>View</a>
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
                color: #003366;
            }}
            h1 {{
                text-align: center;
                margin-top: 20px;
                font-weight: bold;
            }}
            .card {{
                border: none;
                box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
                transition: transform 0.2s;
            }}
            .card:hover {{
                transform: scale(1.05);
            }}
        </style>
    </head>
    <body>
        <div class='container'>
            <h1>Welcome to the Data Visualization App</h1>
            <div class='row mt-5'>
                {cards}
            </div>
        </div>
    </body>
    </html>
    """

# Dynamic route for visualizations
@app.route('/visualization/<name>')
def visualization(name):
    if name in VISUALIZATIONS:
        folder_path = os.path.join(BASE_DIR, VISUALIZATIONS[name])
        return render_template(f'{VISUALIZATIONS[name]}')
    else:
        return "Visualization not found", 404

# Serve static files (JS, CSS, etc.) for each visualization
@app.route('/visualization/<name>/static/<path:filename>')
def serve_static(name, filename):
    if name in VISUALIZATIONS:
        folder_path = os.path.join(BASE_DIR, VISUALIZATIONS[name])
        return send_from_directory(folder_path, filename)
    else:
        return "File not found", 404

if __name__ == '__main__':
    app.run(debug=True)
