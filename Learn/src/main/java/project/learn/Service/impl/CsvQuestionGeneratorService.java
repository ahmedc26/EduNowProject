package project.learn.Service.impl;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import project.learn.Service.QuestionGeneratorService;
import project.learn.dto.GenerateQuestionRequest;
import project.learn.dto.QuestionResponse;

import java.io.BufferedReader;
import java.io.FileInputStream;
import java.io.InputStreamReader;
import java.nio.charset.StandardCharsets;
import java.text.Normalizer;
import java.util.*;
import java.util.function.Predicate;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
public class CsvQuestionGeneratorService implements QuestionGeneratorService {

    @Value("${application.dataset.csv-path:education_dataset_normalized.csv}")
    private String csvPath;

    @Override
    public QuestionResponse generateQuestion(GenerateQuestionRequest request) {
        List<Map<String, String>> rows = loadCsvRows();

        // Strict normalized equality filters first
        List<Predicate<Map<String, String>>> strict = new ArrayList<>();
        if (present(request.getLevel())) strict.add(r -> eq(r.get("level"), request.getLevel()));
        if (present(request.getLevelType())) strict.add(r -> eq(r.get("level_type"), request.getLevelType()));
        if (present(request.getSubject())) strict.add(r -> eq(r.get("subject"), request.getSubject()));
        if (present(request.getTopic())) strict.add(r -> eq(r.get("topic"), request.getTopic()));
        if (present(request.getSkill())) strict.add(r -> eq(r.get("competence"), request.getSkill()));
        if (present(request.getSubSkill())) strict.add(r -> eq(r.get("sous_competence"), request.getSubSkill()));
        if (present(request.getSubSubSkill())) strict.add(r -> eq(r.get("sous_sous_competence"), request.getSubSubSkill()));

        List<Map<String, String>> out = applyRelaxed(rows, strict);
        if (!out.isEmpty()) {
            Map<String, String> pick = out.get(new Random().nextInt(out.size()));
            return new QuestionResponse(pick.getOrDefault("question", ""), pick.getOrDefault("response", ""));
        }

        // Fuzzy contains if nothing found
        List<Predicate<Map<String, String>>> fuzzy = new ArrayList<>();
        if (present(request.getLevel())) fuzzy.add(r -> contains(r.get("level"), request.getLevel()));
        if (present(request.getLevelType())) fuzzy.add(r -> contains(r.get("level_type"), request.getLevelType()));
        if (present(request.getSubject())) fuzzy.add(r -> contains(r.get("subject"), request.getSubject()));
        if (present(request.getTopic())) fuzzy.add(r -> contains(r.get("topic"), request.getTopic()));
        if (present(request.getSkill())) fuzzy.add(r -> contains(r.get("competence"), request.getSkill()));
        if (present(request.getSubSkill())) fuzzy.add(r -> contains(r.get("sous_competence"), request.getSubSkill()));
        if (present(request.getSubSubSkill())) fuzzy.add(r -> contains(r.get("sous_sous_competence"), request.getSubSubSkill()));

        out = applyRelaxed(rows, fuzzy);
        if (!out.isEmpty()) {
            Map<String, String> pick = out.get(new Random().nextInt(out.size()));
            return new QuestionResponse(pick.getOrDefault("question", ""), pick.getOrDefault("response", ""));
        }

        return new QuestionResponse("No question found for provided filters.", "");
    }

    private static List<Map<String, String>> applyRelaxed(List<Map<String, String>> rows, List<Predicate<Map<String, String>>> preds) {
        for (int keep = preds.size(); keep >= 0; keep--) {
            Predicate<Map<String, String>> combined = preds.stream().limit(keep).reduce(x -> true, Predicate::and);
            List<Map<String, String>> out = rows.stream().filter(combined).collect(Collectors.toList());
            if (!out.isEmpty()) return out;
        }
        return Collections.emptyList();
    }

    private static boolean present(String s) {
        return s != null && !s.isBlank();
    }

    private static String norm(String s) {
        if (s == null) return "";
        String n = Normalizer.normalize(s, Normalizer.Form.NFD).replaceAll("\\p{InCombiningDiacriticalMarks}+", "");
        return n.trim().toLowerCase(Locale.ROOT);
    }

    private static boolean eq(String a, String b) {
        return norm(a).equals(norm(b));
    }

    private static boolean contains(String a, String b) {
        String na = norm(a);
        String nb = norm(b);
        return !nb.isEmpty() && na.contains(nb);
    }

    private List<Map<String, String>> loadCsvRows() {
        List<Map<String, String>> result = new ArrayList<>();
        if (!readCsvInto(result, csvPath)) {
            // fallback: try front-end assets path
            readCsvInto(result, "learnfront/src/assets/education_dataset_normalized.csv");
        }
        return result;
    }

    private boolean readCsvInto(List<Map<String, String>> target, String path) {
        try (BufferedReader br = new BufferedReader(new InputStreamReader(new FileInputStream(path), StandardCharsets.UTF_8))) {
            String headerLine = br.readLine();
            if (headerLine == null) return false;
            List<String> headers = parseCsvLine(headerLine);
            String line;
            while ((line = br.readLine()) != null) {
                List<String> values = parseCsvLine(line);
                if (values.isEmpty()) continue;
                Map<String, String> row = new HashMap<>();
                for (int i = 0; i < headers.size() && i < values.size(); i++) {
                    row.put(headers.get(i), values.get(i));
                }
                target.add(row);
            }
            return true;
        } catch (Exception e) {
            return false;
        }
    }

    // Minimal CSV parser handling quotes and commas
    private List<String> parseCsvLine(String line) {
        List<String> cells = new ArrayList<>();
        StringBuilder sb = new StringBuilder();
        boolean inQuotes = false;
        for (int i = 0; i < line.length(); i++) {
            char c = line.charAt(i);
            if (c == '"') {
                if (inQuotes && i + 1 < line.length() && line.charAt(i + 1) == '"') {
                    sb.append('"'); // escaped quote
                    i++;
                } else {
                    inQuotes = !inQuotes;
                }
            } else if (c == ',' && !inQuotes) {
                cells.add(sb.toString().trim());
                sb.setLength(0);
            } else {
                sb.append(c);
            }
        }
        cells.add(sb.toString().trim());
        return cells;
    }
}


